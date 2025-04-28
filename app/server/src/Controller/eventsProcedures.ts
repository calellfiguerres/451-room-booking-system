import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import db from '../Models/database';

// Store connected clients
const clients: Map<string, Response> = new Map();

/**
 * Events service for real-time notifications and room booking updates
 */
export class EventsService {
  /**
   * Send a notification to a specific student
   * @param studentId Student ID to send notification to
   * @param content Notification content
   * @returns The ID of the created notification
   */
  public static async sendNotification(studentId: string, content: string): Promise<string> {
    // Create notification in database
    const id = randomUUID();
    await db.connection.none(
      `INSERT INTO Notifications (id, studentId, content)
       VALUES ($1, $2, $3)`,
      [id, studentId, content]
    );
    
    // Send to connected client if online
    const clientId = `user-${studentId}`;
    const client = clients.get(clientId);
    
    if (client) {
      try {
        client.write(`data: ${JSON.stringify({
          type: 'notification',
          id,
          content,
          timestamp: new Date()
        })}\n\n`);
      } catch (error) {
        console.error('Error sending notification to client:', error);
        // Remove disconnected client
        clients.delete(clientId);
      }
    }
    
    return id;
  }
  
  /**
   * Broadcast room status change to all connected clients
   * @param roomId Room ID that changed status
   * @param status New status ('booked' or 'available')
   * @param bookedBy Student ID who booked the room (if applicable)
   */
  public static broadcastRoomStatus(roomId: string, status: string, bookedBy?: string): void {
    const message = JSON.stringify({
      type: 'room-status',
      roomId,
      status,
      bookedBy,
      timestamp: new Date()
    });
    
    // Send to all connected clients
    clients.forEach((client, clientId) => {
      try {
        client.write(`data: ${message}\n\n`);
      } catch (error) {
        console.error(`Error sending to client ${clientId}:`, error);
        // Remove disconnected client
        clients.delete(clientId);
      }
    });
  }
}

/**
 * Handle SSE connections
 * @param req Express request
 * @param res Express response
 */
export function handleSSE(req: Request, res: Response): void {
  const studentId = req.query.studentId as string;
  
  if (!studentId) {
    res.status(400).json({ error: 'Student ID is required' });
    return;
  }
  
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  
  // Store client connection
  const clientId = `user-${studentId}`;
  clients.set(clientId, res);
  
  // Remove client on connection close
  req.on('close', () => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
  
  console.log(`Client ${clientId} connected`);
}

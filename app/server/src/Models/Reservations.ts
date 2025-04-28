// this import is extremely important, leave it alone or else you better impulsively lock your doors and windows
import { resolveResponse } from "@trpc/server/unstable-core-do-not-import";
import { randomUUID } from "node:crypto";
import { EventsService } from "../Controller/eventsProcedures";

import db from "./database";

/**
 * Retrieves the current reservation request for a user and a user's reservation history.
 */
export class Reservations {
    /**
     * Constructor 
     * @param reservationID => Reservation request ID.
     * @param studentID => Student ID.
     * @param roomID => Room ID on reservation.
     * @param openDate => When the window to apply opens/opened.
     * @param closeDate => When the window to apply closes/closed.
     */
    constructor(
        public reservationID: number,
        public studentID: string,
        public roomID: string,
        public openDate: Date,
        public closeDate: Date
    ) {}

    /**
     * Fetches room reservation history.
     * @param studentID ID of the student viewing their history.
     * @returns Reservation history.
     */
    public static async getReservationHistory(studentID: string) {
        const response = await db.connection.any(
            `SELECT rr.*, r.name AS roomName, r.location AS roomLocation
            FROM RoomRequest rr JOIN Room r ON rr.roomId = r.ID
            WHERE rr.studentId = $1
            ORDER BY rr.openDate DESC`, [studentID]
        );
        const result = response.map((r) => ({
            reservationID: r.reservationid,
            studentID: r.studentid,
            roomID: r.roomid,
            roomName: r.roomname,
            location: r.location,
            openDate: r.opendate,
            closeDate: r.closedate,
            isActive: new Date() >= r.opendate && new Date() <= r.closedate
        }));
        return result;
    }
    public static async getNotifications(studentID: string) {
        const response = await db.connection.any(
            `SELECT 
                Notifications.id AS notification_id, 
                Notifications.studentId AS student_id,
                Student.username AS student_name, 
                Notifications.content 
            FROM Notifications
            JOIN Student ON Notifications.studentId = Student.ID
            WHERE Notifications.studentId = $1;`, [studentID]
        );
        const result = response.map((r) => ({
            notificationID: r.notification_id,
            studentID: r.student_id,
            studentName: r.student_name,
            text: r.content
        }));
        return result;
    }

    /**
     * Fetches the current reservation made by a student.
     * @param studentID ID of the student viewing their current reservation.
     * @returns A room reservation if it exists, otherwise null.
     */
    public static async getCurrentReservation(studentID: string) {
        const now = new Date();
        const response = await db.connection.oneOrNone(
            `SELECT rr.*, r.name as roomName, r.location as roomLocation
            FROM RoomRequest rr JOIN Room r ON rr.roomid = r.id
            WHERE rr.studentid = $1 AND $2 BETWEEN rr.opendate AND rr.closedate
            ORDER BY rr.closedate DESC LIMIT 1`,
            [studentID, now]
        );
        if (!response) return null;
        return {
            reservationID: response.reservationid,
            studentID: response.studentid,
            roomID: response.roomid,
            roomName: response.roomname,
            roomLocation: response.roomLocation,
            openDate: response.opendate,
            closeDate: response.closedate,
            isActive: true
        }
    }

    /**
     * Creates a new room booking with real-time updates
     * @param studentID Student making the booking
     * @param roomID Room to book
     * @param openDate Start date of booking
     * @param closeDate End date of booking
     * @returns The new booking details or throws an error if booking fails
     */
    public static async createReservationWithRealtime(
        studentID: string,
        roomID: string,
        openDate: Date,
        closeDate: Date
    ) {
        // Use a transaction for atomic operations
        return await db.connection.tx(async t => {
            // Check if room is available with row locking
            const room = await t.oneOrNone(
                `SELECT ID, booked, booked_by, Name, Location 
                FROM Room WHERE ID = $1 FOR UPDATE`,
                [roomID]
            );
            
            if (!room) {
                throw new Error(`Room with ID ${roomID} does not exist`);
            }
            
            if (room.booked) {
                throw new Error(`Room ${room.name} is already booked`);
            }
            
            // Generate request ID
            const requestID = randomUUID();
            
            // Create the booking
            await t.none(
                `INSERT INTO RoomRequest (requestID, studentId, roomId, openDate, closeDate)
                VALUES ($1, $2, $3, $4, $5)`,
                [requestID, studentID, roomID, openDate, closeDate]
            );
            
            // Update room status
            await t.none(
                `UPDATE Room SET booked = true, booked_by = $1 WHERE ID = $2`,
                [studentID, roomID]
            );
            
            // Get room details for the response
            const roomDetails = await t.one(
                `SELECT Name as roomName, Location as roomLocation FROM Room WHERE ID = $1`,
                [roomID]
            );
            
            // Send real-time notification
            await EventsService.sendNotification(
                studentID,
                `Your booking for ${roomDetails.roomname} (${roomDetails.roomlocation}) was successful`
            );
            
            // Broadcast room status change to all connected clients
            EventsService.broadcastRoomStatus(roomID, 'booked', studentID);
            
            // Return the booking details
            return {
                reservationID: requestID,
                studentID,
                roomID,
                roomName: roomDetails.roomname,
                roomLocation: roomDetails.roomlocation,
                openDate,
                closeDate,
                isActive: true
            };
        }).catch(error => {
            console.error('Error creating reservation:', error);
            throw error;
        });
    }

    /**
     * Cancels an existing booking
     * @param reservationID Booking to cancel
     * @returns Status of the cancellation
     */
    public static async cancelReservation(reservationID: string) {
        return await db.connection.tx(async t => {
            // Get booking details
            const booking = await t.oneOrNone(
                `SELECT RR.studentId, RR.roomId, R.Name, R.Location 
                FROM RoomRequest RR
                JOIN Room R ON RR.roomId = R.ID 
                WHERE RR.requestID = $1`,
                [reservationID]
            );
            
            if (!booking) {
                throw new Error('Booking not found');
            }
            
            // Update room status
            await t.none(
                `UPDATE Room SET booked = false, booked_by = NULL WHERE ID = $1`,
                [booking.roomid]
            );
            
            // Mark the booking as canceled (update closeDate to current date)
            await t.none(
                `UPDATE RoomRequest SET closeDate = CURRENT_DATE WHERE requestID = $1`,
                [reservationID]
            );
            
            // Send notification to the student
            await EventsService.sendNotification(
                booking.studentid,
                `Your booking for ${booking.name} (${booking.location}) has been canceled`
            );
            
            // Broadcast room status change
            EventsService.broadcastRoomStatus(booking.roomid, 'available');
            
            return { 
                success: true, 
                message: `Booking for ${booking.name} has been canceled`
            };
        }).catch(error => {
            console.error('Error canceling reservation:', error);
            throw new Error(`Failed to cancel reservation: ${error.message}`);
        });
    }
}

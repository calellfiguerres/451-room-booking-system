import { randomUUID } from "crypto";
import db from "./database";

export class MaintenanceRequest {
  constructor(
    public id: string,
    public studentId: string,
    public roomId: string,
    public description: string,
    public openDate: Date,
    public closeDate: Date | null,
    public status: string
  ) {}

  public static async getAll() {
    const response = await db.connection.any("SELECT * FROM maintenance_request");
    const result = response.map((r) => new MaintenanceRequest(
      r.id, 
      r.studentid, 
      r.roomid, 
      r.description, 
      new Date(r.opendate), 
      r.closedate ? new Date(r.closedate) : null, 
      r.status
    ));
    return result;
  }

  public static async getById(id: string) {
    const response = await db.connection.one("SELECT * FROM maintenance_request WHERE id = $1", [id]);
    const result = new MaintenanceRequest(
      response.id, 
      response.studentid, 
      response.roomid, 
      response.description, 
      new Date(response.opendate), 
      response.closedate ? new Date(response.closedate) : null, 
      response.status
    );
    return result;
  }

  public static async getByStudent(studentId: string) {
    const response = await db.connection.any(
      "SELECT * FROM maintenance_request WHERE studentid = $1 ORDER BY opendate DESC", 
      [studentId]
    );
    const result = response.map((r) => new MaintenanceRequest(
      r.id, 
      r.studentid, 
      r.roomid, 
      r.description, 
      new Date(r.opendate), 
      r.closedate ? new Date(r.closedate) : null, 
      r.status
    ));
    return result;
  }

  public static async add(request: MaintenanceRequest): Promise<MaintenanceRequest>;
  public static async add(studentId: string, roomId: string, description: string): Promise<MaintenanceRequest>;
  public static async add(arg1: MaintenanceRequest | string, roomId?: string, description?: string): Promise<MaintenanceRequest> {
    const id = randomUUID();
    const now = new Date();
    
    if (arg1 instanceof MaintenanceRequest) {
      const request = arg1;
      await db.connection.none(
        `INSERT INTO maintenance_request (id, studentid, roomid, description, opendate, closedate, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, request.studentId, request.roomId, request.description, now, null, 'open']
      );
      return new MaintenanceRequest(
        id, 
        request.studentId, 
        request.roomId, 
        request.description, 
        now, 
        null, 
        'open'
      );
    } else if (arg1 && roomId && description) {
      const studentId = arg1;
      await db.connection.none(
        `INSERT INTO maintenance_request (id, studentid, roomid, description, opendate, closedate, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, studentId, roomId, description, now, null, 'open']
      );
      return new MaintenanceRequest(
        id, 
        studentId, 
        roomId, 
        description, 
        now, 
        null, 
        'open'
      );
    } else {
      throw new Error("Invalid `MaintenanceRequest.add` arguments");
    }
  }
}
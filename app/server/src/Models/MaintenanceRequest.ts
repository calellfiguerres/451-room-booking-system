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

}
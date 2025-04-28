import { randomUUID } from "crypto";
import db from "./database";
import { response } from "express";
import { string } from "zod";

/**
 * Database model for room applications.
 */
export class RoomApplication {
  /**
   * Constructor for table attributes.
   * @param id Application ID.
   * @param studentId Student ID.
   * @param roomId Dorm room ID.
   * @param requestDate Date the application was made.
   * @param startDate Date the lease starts.
   * @param endDate Date the lease ends.
   * @param status Status of the application (pending, approved, rejected).
   * @param comments Comments from the student or admin.
   */
  constructor(
    public id: string,
    public studentId: string,
    public roomId: string,
    public requestDate: Date,
    public startDate: Date,
    public endDate: Date,
    public status: 'pending' | 'approved' | 'rejected',
    public comments: string
  ) {}

  /**
   * Retrieves all room applications from the database.
   */
  public static async getAllApps() {
    const response = await db.connection.any("SELECT * FROM room_application");
    const result = response.map((r) => new RoomApplication(
      r.id,
      r.student_id,
      r.room_id,
      new Date(r.request_date),
      new Date(r.start_date),
      new Date(r.end_date),
      r.status,
      r.comments
    ));
      return result;
  }

  /**
   * Retrieves a room application by its ID.
   * @param id Application ID.
   */
  public static async getAppById(id: string) {
    const response = await db.connection.one("SELECT * FROM room_application WHERE id = $1", [id]);
    const result = new RoomApplication(
      response.id,
      response.student_id,
      response.room_id,
      new Date(response.request_date),
      new Date(response.start_date),
      new Date(response.end_date),
      response.status,
      response.comments
    );
      return result;
  }

  /**
   * Retrieves all applications for a specific student.
   * @param studentId 
   */
  public static async getAppsByStudentId(studentId: string) {
    const response = await db.connection.any(
      "SELECT ra.*, r.name as room_name, r.location as room_location " +
      "FROM room_application ra " +
      "JOIN room r ON ra.room_id = r.id " +
      "WHERE ra.student_id = $1 " +
      "ORDER BY ra.request_date DESC",
      [studentId] 
    );
    const result = response.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      roomId: r.room_id,
      roomName: r.room_name,
      roomLocation: r.room_location,
      requestDate: new Date(r.request_date),
      startDate: new Date(r.start_date),
      endDate: new Date(r.end_date),
      status: r.status,
      comments: r.comments
    }));
    return result;
  }

  /**
   * Adds a new application to the database.
   * @param application Application to be submitted.
   */
  public static async addApp(application: RoomApplication): Promise<RoomApplication>;
  public static async addApp(
    studentId: string,
    roomId: string,
    startDate: Date,
    endDate: Date,
    comments: string
  ): Promise<RoomApplication>;
  public static async addApp(
    arg: RoomApplication | string,
    roomId?: string,
    startDate?: Date,
    endDate?: Date,
    comments?: string
  ): Promise<RoomApplication> {
    const id = randomUUID();
    const date = new Date();
    if (arg instanceof RoomApplication) {
      const app = arg;
      // insert application into the database
      await db.connection.none(
        `INSERT INTO room_application (id, student_id, room_id, request_date, start_date, end_date, status, comments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, app.studentId, app.roomId, date, app.startDate, app.endDate, 'pending', app.comments]
      );
      // send notification to the student
      const notificationId = randomUUID();
      await db.connection.none(
        `INSERT INTO notifications (id, student_id, content)
        VALUES ($1, $2, $3)`,
        [notificationId, app.studentId, `Application Submitted!`]
      );
      return new RoomApplication(
        id,
        app.studentId,
        app.roomId,
        date,
        app.startDate,
        app.endDate,
        'pending',
        app.comments
      );
    } else if (arg && roomId && startDate && endDate) {
      const studentId = arg;
      await db.connection.none(
        `INSERT INTO room_application (id, student_id, room_id, request_date, start_date, end_date, status, comments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, studentId, roomId, date, startDate, endDate, 'pending', comments || '']
      );
      const notificationId = randomUUID();
      await db.connection.none(
        `INSERT INTO notifications (id, student_id, content)
        VALUES ($1, $2, $3)`,
        [notificationId, studentId, `Application Submitted!`]
      );
      return new RoomApplication(
        id,
        studentId,
        roomId,
        date,
        startDate,
        endDate,
        'pending',
        comments || ''
      );
    } else {
      throw new Error("Invalid arguments provided to addApp");
    }
  }

  /**
   * Updates an existing application in the database.
   * @param id Application ID.
   * @param status New status of the application (pending, approved, rejected).
   * @param adminId Admin ID.
   * @returns The updated application.
   */
  public static async updateApp(
    id: string,
    status: 'pending' | 'approved' | 'rejected',
    adminId?: string
  ): Promise<RoomApplication> {
    const response = await db.connection.one(
      `UPDATE room_application
      SET status = $1
      WHERE id = $2
      RETURNING *`,
      [status, id]
    );
    const studentId = response.student_id;
    const notificationId = randomUUID();
    const message = `Application ${status}.`;
    await db.connection.none(
      `INSERT INTO notifications (id, studentid, content)
      VALUES ($1, $2, $3)`,
      [notificationId, studentId, message]
    );
    if (status === 'approved') {
      const requestId = randomUUID();
      await db.connection.none(
        `INSERT INTO roomrequest (requestid, studentid, roomid, opendate, closedate)
        VALUES ($1, $2, $3, $4, $5)`,
        [requestId, response.student_id, response.room_id, response.start_date, response.end_date]
      );
      // If an admin ID is provided, insert into adminroomrequestmanagement
      if (adminId) {
        const managementId = randomUUID();
        await db.connection.none(
          `INSERT INTO adminroomrequestmanagement (managementid, adminid, requestid)
          VALUES ($1, $2, $3)`,
          [managementId, adminId, requestId]
        );
      }
    }
    return new RoomApplication(
      response.id,
      response.student_id,
      response.room_id,
      new Date(response.request_date),
      new Date(response.start_date),
      new Date(response.end_date),
      response.status,
      response.comments
    );
  }
}
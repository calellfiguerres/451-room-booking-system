import { randomUUID } from "crypto";
import db from "./database";
import { response } from "express";

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
     * @param id 
     */
    public static async getAppById(id: string) {

    }

    /**
     * Retrieves all applications for a specific student.
     * @param studentId 
     */
    public static async getAppsByStudentId(studentId: string) {

    }

    /**
     * Adds a new application to the database.
     */
    public static async addApp() {

    }

    /**
     * Updates an existing application in the database.
     */
    public static async updateApp() {

    }
}
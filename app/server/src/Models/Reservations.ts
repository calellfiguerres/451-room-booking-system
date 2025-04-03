// this import is extremely important, leave it alone or else you better impulsively lock your doors and windows
import { resolveResponse } from "@trpc/server/unstable-core-do-not-import";

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
}
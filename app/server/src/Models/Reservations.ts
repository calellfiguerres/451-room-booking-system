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

    /**
     * Fetches the current reservation made by a student.
     * @param studentID ID of the student viewing their current reservation.
     * @returns A room reservation if it exists, otherwise null.
     */
    public static async getCurrentReservation(studentID: string) {
        return  0;
    }
}
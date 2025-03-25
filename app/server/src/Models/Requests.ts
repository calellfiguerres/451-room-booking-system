import db from "./database";

/**
 * Retrieves the current reservation request for a user and a user's reservation history.
 */
export class Requests {
    /**
     * Constructor 
     * @param requestID => Reservation request ID.
     * @param studentID => Student ID.
     * @param roomID => Room ID on reservation.
     * @param isOpen => When the window to apply opens/opened.
     * @param isClosed => When the window to apply closes/closed.
     */
    constructor(
        public requestID: number,
        public studentID: string,
        public roomID: string,
        public isOpen: Date,
        public isClosed: Date
    ) {}

    /**
     * Fetches room reservation history.
     * @param studentID ID of the student viewing their history.
     * @returns Reservation history.
     */
    public static async getReservationHistory(studentID: string) {
        return 0;
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
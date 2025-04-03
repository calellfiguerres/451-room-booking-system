import { Reservations } from "../Models/Reservations";
import db from "../Models/database";

// virtual database
jest.mock("../Models/database", () => ({
    connection: {
        any: jest.fn(),
        oneOrNone: jest.fn(),
        one: jest.fn()
    }
}));

describe("Reservation Applications", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createReservationApplication", () => {
        it("should successfully generate a reservation application submission", async () => {
            const studentID = "12345";
            const roomID = "room-1";
            const openDate = new Date("2025-03-04");
            const closeDate = new Date("2025-08-01");
            const mockReservationID = { requestid: 789 };
            (db.connection.one as jest.Mock).mockResolvedValue(mockReservationID);
            const result = await Reservations.createReservationApplication(
                studentID, roomID, openDate, closeDate
            );
            expect(db.connection.one).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO RoomRequest"),
                [studentID, roomID, openDate, closeDate]
            );
            expect(result).toHaveProperty("reservationID", 789);
            expect(result).toHaveProperty("studentID", studentID);
            expect(result).toHaveProperty("roomID", roomID);
            expect(result).toHaveProperty("openDate", openDate);
            expect(result).toHaveProperty("closeDate", closeDate);
            expect(result).toHaveProperty("isActive");
        });

        it("should throw database errors when generating an application submission", async () => {
            const msg = "Database error";
            (db.connection.one as jest.Mock).mockRejectedValue(new Error(msg));
            const studentID = "12345";
            const roomID = "room-1";
            const openDate = new Date("2025-03-04");
            const closeDate = new Date("2025-08-01");
            await expect(
                Reservations.createReservationApplication(studentID, roomID, openDate, closeDate)
            ).rejects.toThrow(msg);
        });
    });

    describe("getReservationHistory", () => {
        it("Should produce the reservation history for a student-user", async () => {
            const studentID = "Test_User";
            const mockReservations = [
                {
                    reservationid: 1,
                    studentid: studentID,
                    roomid: "room-1",
                    roomname: "Stephenson 311",
                    location: "Stephenson North",
                    opendate: new Date("2025-03-04"),
                    closedate: new Date("2025-08-01")
                },
                {
                    reservationid: 2,
                    studentid: studentID,
                    roomid: "room-2",
                    roomname: "Stephenson 312",
                    location: "Stephenson North",
                    opendate: new Date("2025-03-04"),
                    closedate: new Date("2025-08-01")
                }
            ];

            (db.connection.any as jest.Mock).mockResolvedValue(mockReservations);
            const result = await Reservations.getReservationHistory(studentID);
            expect(db.connection.any).toHaveBeenCalledWith(
                expect.stringContaining("SELECT rr.*, r.name AS roomName, r.location AS roomLocation"),
                [studentID]
            );
            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty("reservationID", 1);
            expect(result[0]).toHaveProperty("roomName", "Stephenson 311");
            expect(result[0]).toHaveProperty("isActive", expect.any(Boolean));
        });

        it("Should return null because the student has never had a reservation.", async () => {
            (db.connection.any as jest.Mock).mockResolvedValue([]);
            const result = await Reservations.getReservationHistory("erm_what_the_sigma");
            expect(result).toEqual([]);
        });
    });

    describe("getCurrentReservation", () => {
        it("Should return the student's current reservation.", async () => {
            const studentID = "Test_User";
            const mockCurrentReservation = {
                reservationid: 1,
                studentid: studentID,
                roomid: "room-1",
                roomname: "Stephenson 311",
                location: "Stephenson North",
                opendate: new Date("2025-03-04"),
                closedate: new Date("2025-08-01")
            };
            (db.connection.oneOrNone as jest.Mock).mockResolvedValue(mockCurrentReservation);
            const result = await Reservations.getCurrentReservation(studentID);
            expect(db.connection.oneOrNone).toHaveBeenCalledWith(
                expect.stringContaining("BETWEEN rr.opendate AND rr.closedate"),
                [studentID, expect.any(Date)]
            );
            expect(result).not.toBeNull();
            expect(result).toHaveProperty("reservationID", 1);
            expect(result).toHaveProperty("roomName", "Stephenson 311");
            expect(result).toHaveProperty("isActive", true);
        });

        it("should return null when student has no current dorm room assignment", async () => {
            (db.connection.oneOrNone as jest.Mock).mockResolvedValue(null);
            const result = await Reservations.getCurrentReservation("erm_what_the_sigma");
            expect(result).toBeNull();
        });
    });
});
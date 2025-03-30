import { router } from "../Controller/trpc";
import { bookingProcedures } from "../Controller/bookingProcedures";
import { protectedCall } from "../Controller/utilities";
import { Reservations } from "../Models/Reservations";
import { TRPCError } from "@trpc/server";
import { Student } from "../Models/Student";

jest.mock("../Models/Reservations");
jest.mock("../Controller/utilities");

describe("Booking Procedures", () => {
    const mockStudent = {
        id: "12345",
        firstname: "John",
        lastname: "Doe" 
    } as Student;

    const mockCurrentReservation = {
        reservationid: 1,
        studentid: "12345",
        roomid: "room-1",
        roomname: "Stephenson 311",
        location: "Stephenson North",
        opendate: new Date("2025-03-04"),
        closedate: new Date("2025-08-01"),
        isActive: true
    };

    const mockReservations = [
        mockCurrentReservation,
        {
            reservationid: 2,
            studentid: "12345",
            roomid: "room-2",
            roomname: "Olympia 200",
            location: "Olympia",
            opendate: new Date("2025-10-15"),
            closedate: new Date("2025-12-05"),
            isActive: false
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getCurrentReservation", () => {
        it("should retrieve the current reservation for the user", async () => {
            (protectedCall as jest.Mock).mockResolvedValue({
                success: true,
                result: mockCurrentReservation,
                error: null
            });

            const ctx = { user: mockStudent };
            const result = await bookingProcedures.getCurrentReservation.query(
                { ctx } as any
            );
            expect(protectedCall).toHaveBeenCalled();
            expect(result).toEqual(mockCurrentReservation);
        });
        it("should throw an error", async () => {
            (protectedCall as jest.Mock).mockResolvedValue({
                success: false,
                result: null,
                error: new Error("Database error")
            });
            const ctx = { user: mockStudent };
            await expect(
                bookingProcedures.getCurrentReservation.query({ ctx } as any)
            ).rejects.toThrow(TRPCError);
        });
    });

    describe("getReservationHistory", () => {
        it("should return room reservation history to the user", async () => {
            (protectedCall as jest.Mock).mockResolvedValue({
                success: true,
                result: mockCurrentReservation,
                error: null
            });

            const ctx = { user: mockStudent };
            const result = await bookingProcedures.getReservationHistory.query(
                { ctx } as any
            );

            expect(protectedCall).toHaveBeenCalled();
            expect(result).toEqual(mockReservations);
            expect(result).toHaveLength(2);
        });

        it("should throw an error", async () => {
            (protectedCall as jest.Mock).mockResolvedValue({
                success: false,
                result: null,
                error: new Error("Database Failure")
            });

            const ctx = { user: mockStudent };
            await expect(
                bookingProcedures.getReservationHistory.query({ ctx } as any)
            ).rejects.toThrow(TRPCError);
        });
    });
});
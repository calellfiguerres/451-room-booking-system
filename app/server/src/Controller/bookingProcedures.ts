import { router, studentOnlyProcedure, authenticatedProcedure } from "./trpc";
import { Reservations } from "../Models/Reservations";
import { protectedCall } from "./utilities";
import { TRPCError } from "@trpc/server";
import { Student } from "../Models/Student";
import { authProcedures } from "./authProcedures";

/**
 * Implements procedures for reservations.
 */
export const bookingProcedures = router({
 
    /**
     * Defines the procedure for retrieving a student's current reservation if they have one.
     * @returns The student's current reservation, null if they do not have one.
     */
    getCurrentReservation: studentOnlyProcedure.query(async (opts) => {
        const { ctx } = opts;
        const student = ctx.user as Student;
        const bookingCall = await protectedCall(async () => {
            return await Reservations.getCurrentReservation(student.id);
        });
        if (!bookingCall.success) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not retrieve reservation." });
        }
        return bookingCall.result;
    }),

    /**
     * Defines the procedure for retrieving a student's reservation history.
     * @returns A list of the student's past reservations.
     */
    getReservationHistory: studentOnlyProcedure.query(async (opts) => {
        const { ctx } = opts;
        const student = ctx.user as Student;
        const historyCall = await protectedCall(async () => {
            return await Reservations.getReservationHistory(student.id);
        });
        if (!historyCall.success) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not retrieve reservation history." });
        }
        return historyCall.result;
    }),
    
    getNotifications: studentOnlyProcedure.query(async (opts) => {
        const { ctx } = opts;
        const student = ctx.user as Student;
        const notificationsCall = await protectedCall(async () => {
            return await Reservations.getNotifications(student.id);
        });
        if (!notificationsCall.success) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not retrieve notifications." });
        }
        return notificationsCall.result;
    }), 
})
import { router, studentOnlyProcedure } from "./trpc";
import { Reservations } from "../Models/Reservations";
import { protectedCall } from "./utilities";
import { TRPCError } from "@trpc/server";
import { Student } from "../Models/Student";
import z from "zod";

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

    /**
     * Defines the procedure for generating a reservation application for a room.
     * @returns call for an application submission request.
     */
    createReservationApplication: studentOnlyProcedure.input(
        z.object({
            roomID: z.string().nonempty(),
            openDate: z.date(),
            closeDate: z.date()
        })
    ).mutation(async (opts) => {
        const { ctx, input } = opts;
        const student = ctx.user as Student;
        if (input.closeDate <= input.openDate) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Close date should be later than open date."
            });
        }
        const appCall = await protectedCall(async () => {
            return await Reservations.createReservationApplication(
                student.id,
                input.roomID,
                input.openDate,
                input.closeDate
            );
        });
        if (!appCall.success) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while generating your application."
            });
        }
        return appCall.result;
    })
})
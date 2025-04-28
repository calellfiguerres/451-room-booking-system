import { router, studentOnlyProcedure, authenticatedProcedure } from "./trpc";
import { Reservations } from "../Models/Reservations";
import { protectedCall } from "./utilities";
import { TRPCError } from "@trpc/server";
import { Student } from "../Models/Student";
import { authProcedures } from "./authProcedures";
import { z } from "zod";

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
     * Defines the procedure for creating a new reservation with real-time updates.
     * @returns The newly created reservation.
     */
    createReservationRealtime: studentOnlyProcedure
        .input(z.object({
            roomID: z.string(),
            openDate: z.date(),
            closeDate: z.date()
        }))
        .mutation(async (opts) => {
            const { ctx, input } = opts;
            const student = ctx.user as Student;
            
            const reservationCall = await protectedCall(async () => {
                return await Reservations.createReservationWithRealtime(
                    student.id,
                    input.roomID,
                    input.openDate,
                    input.closeDate
                );
            });
            
            if (!reservationCall.success) {
                throw new TRPCError({ 
                    code: "INTERNAL_SERVER_ERROR", 
                    message: reservationCall.error?.message || "Failed to create reservation." 
                });
            }
            
            return reservationCall.result;
        }),

    /**
     * Defines the procedure for canceling a reservation with real-time updates.
     * @returns Status of the cancellation.
     */
    cancelReservation: studentOnlyProcedure
        .input(z.object({
            reservationID: z.string()
        }))
        .mutation(async (opts) => {
            const { ctx, input } = opts;
            const student = ctx.user as Student;
            
            // Verify the reservation belongs to this student
            const reservations = await Reservations.getReservationHistory(student.id);
            const reservation = reservations.find(r => r.reservationID === input.reservationID);
            
            if (!reservation) {
                throw new TRPCError({ 
                    code: "FORBIDDEN", 
                    message: "You don't have permission to cancel this reservation." 
                });
            }
            
            const cancellationCall = await protectedCall(async () => {
                return await Reservations.cancelReservation(input.reservationID);
            });
            
            if (!cancellationCall.success) {
                throw new TRPCError({ 
                    code: "INTERNAL_SERVER_ERROR", 
                    message: cancellationCall.error?.message || "Failed to cancel reservation." 
                });
            }
            
            return cancellationCall.result;
        })
});
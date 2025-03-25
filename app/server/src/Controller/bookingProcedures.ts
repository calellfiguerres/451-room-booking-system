import { router, studentOnlyProcedure } from "./trpc";
import { Reservations } from "../Models/Reservations";
import { protectedCall } from "./utilities";
import { TRPCError } from "@trpc/server";
import { Student } from "../Models/Student";

/**
 * Implements procedures for reservations.
 */
export const bookingProcedures = router({

    /**
     * Defines the procedure for retrieving a student's current reservation if they have one.
     * @returns The student's current reservation, null if they do not have one.
     */
    getCurrentReservation: studentOnlyProcedure.query(async (opts) => {
        return 0;
    }),

    /**
     * Defines the procedure for retrieving a student's reservation history.
     * @return A list of the student's past reservations.
     */
    getReservationHistory: studentOnlyProcedure.query(async (opts) => {
        return 0;
    })
})
import { TRPCError } from "@trpc/server";
import z from "zod";
import { RoomApplication } from "../Models/RoomApplication";
import { adminOnlyProcedure, authenticatedProcedure, studentOnlyProcedure, router } from "./trpc";
import { protectedCall } from "./utilities";

/**
 * Application procedures for managing room applications.
 */
export const applicationProcedures = router({
    
})
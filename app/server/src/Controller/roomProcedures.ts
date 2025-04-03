import { TRPCError } from "@trpc/server";
import z from "zod";
import { Room } from "../Models/Room";
import { authenticatedProcedure, publicProcedure, router } from "./trpc";
import { protectedCall } from "./utilities";

export const roomProcedures = router({
  // get all rooms (no filter)
  getAllRooms: publicProcedure.query(async () => {
    const result = await protectedCall(async () => {
      return await Room.getAll();
    });
    
    if (!result.success) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch rooms"
      });
    }
    
    return result.result;
  }),
  
  // search rooms by criteria
  searchRooms: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      location: z.string().optional(),
      description: z.string().optional()
    }))
    .query(async (opts) => {
      const { input } = opts;
      
      const searchResult = await protectedCall(async () => {
        return await Room.search(input);
      });
      
      if (!searchResult.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search rooms"
        });
      }
      
      return searchResult.result;
    })
});
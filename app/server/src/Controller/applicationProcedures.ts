import { TRPCError } from "@trpc/server";
import z from "zod";
import { RoomApplication } from "../Models/RoomApplication";
import { adminOnlyProcedure, studentOnlyProcedure, router } from "./trpc";
import { protectedCall } from "./utilities";

/**
 * Application procedures for managing room applications.
 */
export const applicationProcedures = router({
  // application submission procedures for users
  submit: studentOnlyProcedure
    .input(z.object({
      roomId: z.string().nonempty(),
      startDate: z.date(),
      endDate: z.date(),
      comments: z.string().optional()
    }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const student = ctx.user;
      if (input.endDate <= input.startDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End date must be after start date."
        });
      }
      const applicationCall = await protectedCall(async () => {
        return await RoomApplication.addApp(
          student.id,
          input.roomId,
          input.startDate,
          input.endDate,
          input.comments || ""
        );
      });
      if (!applicationCall.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate an application."
        });
      }
      return applicationCall.result;
    }),
  // retrieve application(s) for a user
  getApplications: studentOnlyProcedure.query(async (opts) => {
    const student = opts.ctx.user;
    const getApplicationsCall = await protectedCall(async () => {
      return await RoomApplication.getAppsByStudentId(student.id);
    });
    if (!getApplicationsCall.success) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve applications."
      });
    }
    return getApplicationsCall.result;
  }),
  // retrieve all applications for an admin
  getAllApplications: adminOnlyProcedure.query(async () => {
    const getApplicationsCall = await protectedCall(async () => {
      return await RoomApplication.getAllApps();
    });
    if (!getApplicationsCall.success) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve applications."
      });
    }
    return getApplicationsCall.result;
  }),
  // update the status of an application as an admin
  updateApplication: adminOnlyProcedure
    .input(z.object({
      applicationId: z.string().nonempty(),
      status: z.enum(['pending', 'approved', 'rejected']),
    }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const admin = ctx.user;
      const updateApplicationCall = await protectedCall(async () => {
        return await RoomApplication.updateApp(
          input.applicationId,
          input.status,
          admin.id  
        );
      });
      if (!updateApplicationCall.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update application."
        });
      }
      return updateApplicationCall.result;
    })
});
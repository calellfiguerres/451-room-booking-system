import { TRPCError } from "@trpc/server";
import z from "zod";
import { MaintenanceRequest } from "../Models/MaintenanceRequest";
import { Room } from "../Models/Room";
import { authenticatedProcedure, adminOnlyProcedure, router } from "./trpc";
import { protectedCall } from "./utilities";

export const maintenanceProcedures = router({
    // create a new maintenance request
    createMaintenanceRequest: authenticatedProcedure
        .input(z.object({
            studentId: z.string().nonempty(),
            roomId: z.string().nonempty(),
            description: z.string().nonempty(),
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            
            // create the maintenance request
            const createRequestCall = await protectedCall(async () => {
                return await MaintenanceRequest.add(
                    input.studentId,
                    input.roomId,
                    input.description
                );
            });
            
            if (!createRequestCall.success) {
                throw new TRPCError({ 
                    code: "BAD_REQUEST", 
                    message: "Failed to create maintenance request" 
                });
            }
            
            return createRequestCall.result;
        }),
    
    // get the current session
    getSession: authenticatedProcedure.query(async (opts) => {
        return opts.ctx.session;
    }),
    
    // get maintenance requests for a student
    getStudentMaintenanceRequests: authenticatedProcedure
        .input(z.object({
            studentId: z.string().nonempty(),
        }))
        .query(async (opts) => {
            const { input } = opts;
            
            const getRequestsCall = await protectedCall(async () => {
                return await MaintenanceRequest.getByStudent(input.studentId);
            });
            
            if (!getRequestsCall.success) {
                throw new TRPCError({ 
                    code: "BAD_REQUEST", 
                    message: "Failed to fetch maintenance requests" 
                });
            }
            
            return getRequestsCall.result;
        }),
    
    // get a specific maintenance request
    getMaintenanceRequest: authenticatedProcedure
        .input(z.object({
            requestId: z.string().nonempty(),
        }))
        .query(async (opts) => {
            const { input } = opts;
            
            const getRequestCall = await protectedCall(async () => {
                return await MaintenanceRequest.getById(input.requestId);
            });
            
            if (!getRequestCall.success) {
                throw new TRPCError({ 
                    code: "NOT_FOUND", 
                    message: "Maintenance request not found" 
                });
            }
            
            return getRequestCall.result;
        }),
    
    // update maintenance request status
    updateMaintenanceRequestStatus: authenticatedProcedure
        .input(z.object({
            requestId: z.string().nonempty(),
            status: z.enum(['open', 'in-progress', 'closed']),
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            
            const updateStatusCall = await protectedCall(async () => {
                return await MaintenanceRequest.updateStatus(
                    input.requestId,
                    input.status
                );
            });
            
            if (!updateStatusCall.success) {
                throw new TRPCError({ 
                    code: "BAD_REQUEST", 
                    message: "Failed to update maintenance request status" 
                });
            }
            
            return updateStatusCall.result;
        }),
        
    // get student's assigned rooms
    getStudentRooms: authenticatedProcedure
        .input(z.object({
            studentId: z.string().nonempty(),
        }))
        .query(async (opts) => {
            const { input } = opts;
            
            // for now uhhhh return all rooms instead of just the ones assigned to the student
            const getRoomsCall = await protectedCall(async () => {
                return await Room.getAll();
            });
            
            if (!getRoomsCall.success) {
                throw new TRPCError({ 
                    code: "BAD_REQUEST", 
                    message: "Failed to fetch student rooms" 
                });
            }
            
            return getRoomsCall.result;
        }),
        
    // get all maintenance requests (admin only)
    getAllMaintenanceRequests: adminOnlyProcedure.query(async (opts) => {
        const result = await protectedCall(async () => {
            return await MaintenanceRequest.getAll();
        });
        
        if (!result.success) {
            throw new TRPCError({ 
                code: "INTERNAL_SERVER_ERROR", 
                message: "Failed to fetch maintenance requests" 
            });
        }
        
        return result.result;
    }),
    
    // update maintenance request status (admin only)
    updateMaintenanceStatus: adminOnlyProcedure
        .input(z.object({
            requestId: z.string().nonempty(),
            status: z.enum(['open', 'in-progress', 'closed']),
        }))
        .mutation(async (opts) => {
            const { input } = opts;
            
            const updateStatusCall = await protectedCall(async () => {
                return await MaintenanceRequest.updateStatus(
                    input.requestId,
                    input.status
                );
            });
            
            if (!updateStatusCall.success) {
                throw new TRPCError({ 
                    code: "BAD_REQUEST", 
                    message: "Failed to update maintenance request status" 
                });
            }
            
            return updateStatusCall.result;
        })
});
import z, { string } from "zod";
import { router, studentOnlyProcedure } from "./trpc";
import { RoommateRequest } from "../Models/RoommateRequest";
import { Student } from "../Models/Student";

export const roommateRequestProcedures = router({
    getPotentialRoommates: studentOnlyProcedure.query(async (opts) => {
        const requesterId = opts.ctx.user.id;
        const response = await Student.getAll();
        const toReturn = response
            .filter((s) => s.id !== requesterId)
            .map((s) => ({
                firstname: s.firstname,
                lastname: s.lastname,
                id: s.id
            }));
        return toReturn;
    }),
    getAllRoommateRequests: studentOnlyProcedure.query(async (opts) => {
        const response = await RoommateRequest.getAllRoommateRequests();
        return response;
    }),
    getRoommateRequests: studentOnlyProcedure.input(z.object({
        requesterId: z.string()
    }).optional()).query(async (opts) => {
        const requesterId = opts.input?.requesterId || opts.ctx.user.id;
        const response = await RoommateRequest.getRoommateRequests(requesterId);
        console.log(response);
        return response;
    }),
    addRoommateRequest: studentOnlyProcedure.input(z.object({
        requesteeId: z.string().nonempty(),
        message: z.string().nonempty(),
        senddate: z.date()
    })).mutation(async (opts) => {
        const input = opts.input;
        const requesterId = opts.ctx.user.id;
        console.log(input);
        await RoommateRequest.addRoommateRequest(
            requesterId, input.requesteeId, input.message, `${input.senddate.getFullYear()}-${input.senddate.getMonth()}-${input.senddate.getDay()}`
        );
    })
});
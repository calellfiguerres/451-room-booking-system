import { TRPCError } from "@trpc/server";
import { Session } from "../Models/Session";
import z from "zod";
import { Admin } from "../Models/Admin";
import { Student } from "../Models/Student";
import { authenticatedProcedure, publicProcedure, router } from "./trpc";
import { protectedCall } from "./utilities";

export const authProcedures = router({
    login: publicProcedure.input(z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        loginAsAdmin: z.boolean()
    })).query(async (opts) => {
        const { input, ctx } = opts;
        const { res } = ctx;

        const findUserCall = await protectedCall(async () => {
            return await (input.loginAsAdmin ? Admin.getByUsername(input.username) : Student.getByUsername(input.username)); 
        });
        if (!findUserCall.success) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Username or Password Incorrect" });
        }
        const user = findUserCall.result;
        
        const correctPassword = user.checkPassword(input.password);
        if (!correctPassword) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Username or Password Incorrect" });
        }

        const createSessionCall = await protectedCall(async () => {
            return await Session.createSession(user.id, input.loginAsAdmin ? "admin" : "student");
        });
        if (!createSessionCall.success) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Username or Password Incorrect" });
        }
        const session = createSessionCall.result;

        res.cookie("session-token", session.id, {
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return true;
    }),
    logout: authenticatedProcedure.mutation(async (opts) => {
        const { ctx } = opts;
        const { res } = ctx;
    
        const response = await protectedCall(async () => {
            Session.delete(ctx.session.id);
        });

        res.clearCookie("session-token");

        return {
            success: response.result
        };
    }),
    signup: publicProcedure.input(z.object({
        firstname: z.string().nonempty(),
        lastname: z.string().nonempty(),
        username: z.string().nonempty(),
        password: z.string().nonempty(),
        signupAsAdmin: z.boolean()
    })).mutation(async (opts) => {
        const { input } = opts;

        if (input.signupAsAdmin) {
            const createAdminCall = await protectedCall(async () => {
                return await Admin.add(input.username, input.password, input.firstname, input.lastname);
            });
            if (!createAdminCall.success) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Unable to create admin" });
            }
            return createAdminCall.result;
        } else {
            const createStudentCall = await protectedCall(async () => {
                return await Student.add(input.username, input.password, input.firstname, input.lastname);
            });
            if (!createStudentCall.success) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Unable to create student" });
            }
            return createStudentCall.result;
        }
    }),
})
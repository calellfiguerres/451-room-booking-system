import z from "zod";
import { publicProcedure, router } from "./trpc";
import { Admin } from "../Models/Admin";
import { Student } from "../Models/Student";
import { Session } from "../Models/Session";
import { TRPCError } from "@trpc/server";
import { protectedCall } from "./utilities";

export const adminProcedures = router({
    hello: publicProcedure.query(async (opts) => {
        return "hello from admin procedures!";
    }), 
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
    getAdmins: publicProcedure.query(async (opts) => {
        const result = Admin.getAll();
        console.log(result);
        return result;
    }), 
    getStudents: publicProcedure.query(async (opts) => {
        const result = Student.getAll();
        console.log(result);
        return result;
    })
})
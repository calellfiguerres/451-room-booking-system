import z from "zod";
import { adminOnlyProcedure, authenticatedProcedure, publicProcedure, router } from "./trpc";
import { Admin } from "../Models/Admin";
import { Student } from "../Models/Student";
import { Room } from "../Models/Room";
import { Session } from "../Models/Session";
import { TRPCError } from "@trpc/server";
import { protectedCall } from "./utilities";

export const adminProcedures = router({
    hello: publicProcedure.query(async (opts) => {
        return "hello from admin procedures!";
    }),
    getAdmins: adminOnlyProcedure.query(async (opts) => {
        const result = Admin.getAll();
        // console.log(result);
        return result;
    }), 
    getStudents: adminOnlyProcedure.query(async (opts) => {
        const result = Student.getAll();
        // console.log(result);
        return result;
    }),
    getRooms: adminOnlyProcedure.query(async (opts) => {
        const result = Room.getAll();
        // console.log(result);
        return result;
    })
})
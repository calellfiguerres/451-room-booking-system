import { publicProcedure, router } from "./trpc";
import { Admin } from "../Models/Admin";
import { Student } from "../Models/Student";

export const adminProcedures = router({
    hello: publicProcedure.query(async (opts) => {
        return "hello from admin procedures!";
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
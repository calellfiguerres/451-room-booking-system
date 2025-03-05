import { publicProcedure, router } from "./trpc";
import db, {pgp} from "./database";

export const adminProcedures = router({
    hello: publicProcedure.query(async (opts) => {
        return "hello from admin procedures!";
    }), 
    getAdmins: publicProcedure.query(async (opts) => {
        const result = db.connection.any('SELECT * FROM admin');
        console.log(result);
        return result;
    }), 
    getStudents: publicProcedure.query(async (opts) => {
        const result = db.connection.any('SELECT * FROM student');
        console.log(result);
        return result;
    })
})
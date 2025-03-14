import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import superjson from "superjson";
import { protectedCall } from "./utilities";
import { AdminSession, Session, StudentSession } from "../Models/Session";
import { Admin } from "../Models/Admin";
import { Student } from "../Models/Student";

export async function createContext(opts: CreateExpressContextOptions) {
    return {
        req: opts.req,
        res: opts.res
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(async (opts) => {
    const { ctx } = opts;
    const { req } = ctx;

    const sessionId = req.signedCookies["session-token"];

    const getSessionCall = await protectedCall(async () => {
        return await Session.getSession(sessionId);
    });

    if (!getSessionCall.success) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid Session Token" });
    }
    
    const session = getSessionCall.result;

    const getUserCall = await protectedCall(async () => {
        if (session instanceof AdminSession) {
            const adminId = session.adminid;
            return await Admin.getById(adminId);
        } else if (session instanceof StudentSession) {
            const studentId = session.studentid;
            return await Student.getById(studentId);
        }
    });

    if (!getUserCall.success) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid User ID in Session Token" });
    }

    const user = getUserCall.result;

    return opts.next({
        ctx: {
            session: session,
            user: user
        }
    });
});
export const studentOnlyProcedure = authenticatedProcedure.use(async (opts) => {
    const { ctx } = opts;

    const user = ctx.user;

    if (user instanceof Admin) {
        throw new TRPCError({ code: "FORBIDDEN", message: "User type `Admin` not valid for this procedure" });
    }

    return opts.next({
        ctx: {
            user: ctx.user as Student
        }
    });
});
export const adminOnlyProcedure = authenticatedProcedure.use(async (opts) => {
    const { ctx } = opts;

    const user = ctx.user;

    if (user instanceof Student) {
        throw new TRPCError({ code: "FORBIDDEN", message: "User type `Student` not valid for this procedure" });
    }

    return opts.next({
        ctx: {
            user: ctx.user as Admin
        }
    });
});
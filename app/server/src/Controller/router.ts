import { adminProcedures } from "./adminProcedures";
import { authProcedures } from "./authProcedures";
import { router } from "./trpc";

export const procedures = router({
    auth: authProcedures,
    admin: adminProcedures
});

export type Procedures = typeof procedures;
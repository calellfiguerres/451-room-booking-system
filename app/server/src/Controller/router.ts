import { adminProcedures } from "./adminProcedures";
import { router } from "./trpc";

export const procedures = router({
    admin: adminProcedures
});

export type Procedures = typeof procedures;
import { adminProcedures } from "./adminProcedures";
import { authProcedures } from "./authProcedures";
import { maintenanceProcedures } from "./maintenanceProcedures";
import { router } from "./trpc";

export const procedures = router({
    auth: authProcedures,
    admin: adminProcedures,
    maintenance: maintenanceProcedures,
});

export type Procedures = typeof procedures;
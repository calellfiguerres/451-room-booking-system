import { adminProcedures } from "./adminProcedures";
import { authProcedures } from "./authProcedures";
import { maintenanceProcedures } from "./maintenanceProcedures";
import { bookingProcedures } from "./bookingProcedures";
import { router } from "./trpc";

export const procedures = router({
    auth: authProcedures,
    admin: adminProcedures,
    maintenance: maintenanceProcedures,
    reservation: bookingProcedures
});

export type Procedures = typeof procedures;
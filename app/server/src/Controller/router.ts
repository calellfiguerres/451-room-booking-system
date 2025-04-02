import { adminProcedures } from "./adminProcedures";
import { authProcedures } from "./authProcedures";
import { maintenanceProcedures } from "./maintenanceProcedures";
import { bookingProcedures } from "./bookingProcedures";
import { roomProcedures } from "./roomProcedures";
import { router } from "./trpc";

export const procedures = router({
    auth: authProcedures,
    admin: adminProcedures,
    maintenance: maintenanceProcedures,
    reservation: bookingProcedures,
    rooms: roomProcedures
});

export type Procedures = typeof procedures;
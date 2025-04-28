import { adminProcedures } from "./adminProcedures";
import { authProcedures } from "./authProcedures";
import { maintenanceProcedures } from "./maintenanceProcedures";
import { bookingProcedures } from "./bookingProcedures";
import { roomProcedures } from "./roomProcedures";
import { router } from "./trpc";
import { roommateRequestProcedures } from "./roommateRequestProcedures";
import { applicationProcedures } from "./applicationProcedures";

export const procedures = router({
    auth: authProcedures,
    admin: adminProcedures,
    maintenance: maintenanceProcedures,
    reservation: bookingProcedures,
    roommateRequest: roommateRequestProcedures,
    rooms: roomProcedures,
    application: applicationProcedures
});

export type Procedures = typeof procedures;
import { adminProcedures } from "./adminProcedures";
import { authProcedures } from "./authProcedures";
import { bookingProcedures } from "./bookingProcedures";
import { router } from "./trpc";

export const procedures = router({
    auth: authProcedures,
    admin: adminProcedures,
    reservation: bookingProcedures
});

export type Procedures = typeof procedures;
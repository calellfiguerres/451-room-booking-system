import { router } from "../Controller/trpc";
import { bookingProcedures } from "../Controller/bookingProcedures";
import { protectedCall } from "../Controller/utilities";
import { Reservations } from "../Models/Reservations";
import { TRPCError } from "@trpc/server";
import { Student } from "../Models/Student";

jest.mock("../Models/Reservations");
jest.mock("../Controller/utilities");
import { Reservations } from "../Models/Reservations";
import db from "../Models/database";
import { randomUUID } from "crypto";

jest.mock("../Models/database", () => ({
    connection: {
        any: jest.fn(),
        oneOrNone: jest.fn()
    }
}))
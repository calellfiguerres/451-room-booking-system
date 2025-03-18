import { randomUUID } from "crypto";
import db from "./database";

export class Room {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public location: string
    ) {}

    

    public static async getAll() {
        const response = await db.connection.any("SELECT * FROM room");
        const result = response.map((r) => new Room(
            r.id, r.name, r.description, r.location
        ));
        return result;
    }

    public static async getById(id: string) {
        const response = await db.connection.one("SELECT * FROM room WHERE ID = $1", [id]);
        const result = new Room(
            response.id, response.name, response.description, response.location
        );
        return result;
    }

    public static async getByUsername(username: string) {
        const response = await db.connection.one("SELECT * FROM room WHERE name = $1", [name]);
        const result = new Room(
            response.id, response.name, response.description, response.location
        );
        return result;
    }

    public static async add(admin: Room): Promise<Room>;
    public static async add(username: string, password: string, firstname: string, lastname: string): Promise<Room>;
    public static async add(arg1: Room | string, password?: string, firstname?: string, lastname?: string): Promise<Room> {
        const id = randomUUID();
        if (arg1 instanceof Room) {
            const admin = arg1;
            await db.connection.none(
                `INSERT INTO admin (id, name)
                VALUES ($1, $2)`,
                [id, admin.name]
            );
            return admin;
        } 
        // else if (arg1 && password && firstname && lastname) {
        //     const username = arg1;
        //     await db.connection.none(
        //         `INSERT INTO room (id, name)
        //         VALUES ($1, $2)`,
        //         [id, name]
        //     );
        //     return new Room(
        //         id, name,
        //     );
        // } 
        else {
            throw new Error("Invalid `Room.add` arguments");
        }
    }
}
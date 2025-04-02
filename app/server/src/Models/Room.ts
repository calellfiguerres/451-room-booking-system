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

    public static async add(room: Room): Promise<Room>;
    public static async add(name: string, description: string, location: string): Promise<Room>;
    public static async add(arg1: Room | string, description?: string, location?: string): Promise<Room> {
        const id = randomUUID();
        if (arg1 instanceof Room) {
            const room = arg1;
            await db.connection.none(
                `INSERT INTO room (id, name, description, location)
                VALUES ($1, $2, $3, $4)`,
                [id, room.name, room.description, room.location]
            );
            return room;
        }else if (arg1 && description && location){
            const name = arg1;

            await db.connection.none(
                `INSERT INTO room (id, name, description, location)
                VALUES ($1, $2, $3, $4)`,
                [id, name, description, location]
            );
            
            return new Room(
                id, name, description, location
            );
        }
        else {
            throw new Error("Invalid `Room.add` arguments");
        }
    }

    // search for rooms based on criteria
    public static async search(criteria: { 
        name?: string, 
        location?: string, 
        description?: string 
    }) {
        let query = "SELECT * FROM room WHERE 1=1";
        const params: any[] = [];
        let paramIndex = 1;
        
        if (criteria.name) {
        query += ` AND LOWER(name) LIKE LOWER($${paramIndex})`;
        params.push(`%${criteria.name}%`);
        paramIndex++;
        }
        
        if (criteria.location) {
        query += ` AND LOWER(location) LIKE LOWER($${paramIndex})`;
        params.push(`%${criteria.location}%`);
        paramIndex++;
        }
        
        if (criteria.description) {
        query += ` AND LOWER(description) LIKE LOWER($${paramIndex})`;
        params.push(`%${criteria.description}%`);
        paramIndex++;
        }
        
        const response = await db.connection.any(query, params);
        const result = response.map((r) => new Room(
        r.id, r.name, r.description, r.location
        ));
        
        return result;
    }
}
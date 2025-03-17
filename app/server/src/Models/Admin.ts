import { randomUUID } from "crypto";
import db from "./database";

export class Admin {
    constructor(
        public id: string,
        public username: string,
        private password: string,
        public firstname: string,
        public lastname: string
    ) {}

    public checkPassword(input: string): boolean {
        return input === this.password;
    }

    public static async getAll() {
        const response = await db.connection.any("SELECT * FROM admin");
        const result = response.map((r) => new Admin(
            r.id, r.username, r.password, r.firstname, r.lastname
        ));
        return result;
    }

    public static async getById(id: string) {
        const response = await db.connection.one("SELECT * FROM admin WHERE ID = $1", [id]);
        const result = new Admin(
            response.id, response.username, response.password, response.firstname, response.lastname
        );
        return result;
    }

    public static async getByUsername(username: string) {
        const response = await db.connection.one("SELECT * FROM admin WHERE username = $1", [username]);
        const result = new Admin(
            response.id, response.username, response.password, response.firstname, response.lastname
        );
        return result;
    }

    public static async add(admin: Admin): Promise<Admin>;
    public static async add(username: string, password: string, firstname: string, lastname: string): Promise<Admin>;
    public static async add(arg1: Admin | string, password?: string, firstname?: string, lastname?: string): Promise<Admin> {
        const id = randomUUID();
        if (arg1 instanceof Admin) {
            const admin = arg1;
            await db.connection.none(
                `INSERT INTO admin (id, username, password, firstname, lastname)
                VALUES ($1, $2, $3, $4, $5)`,
                [id, admin.username, admin.password, admin.firstname, admin.lastname]
            );
            return admin;
        } else if (arg1 && password && firstname && lastname) {
            const username = arg1;
            await db.connection.none(
                `INSERT INTO admin (id, username, password, firstname, lastname)
                VALUES ($1, $2, $3, $4, $5)`,
                [id, username, password, firstname, lastname]
            );
            return new Admin(
                id, username, password, firstname, lastname
            );
        } else {
            throw new Error("Invalid `Admin.add` arguments");
        }
    }
}
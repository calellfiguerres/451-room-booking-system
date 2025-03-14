import { randomUUID } from "crypto";
import db from "./database";
import { Admin } from "./Admin";
import { Student } from "./Student";

interface SessionBase {
    id: string;
}

export class AdminSession implements SessionBase {
    private _admin?: Admin

    constructor(
        readonly id: string,
        readonly adminid: string 
    ) {}

    public async getAdmin() {
        if (this._admin) {
            return this._admin;
        }

        this._admin = await Admin.getById(this.adminid);
        return this._admin;
    }
}

export class StudentSession implements SessionBase {
    private _student?: Student;
    
    constructor(
        readonly id: string,
        readonly studentid: string
    ) {}

    public async getStudent() {
        if (this._student) {
            return this._student;
        }

        this._student = await Student.getById(this.studentid);
        return this._student;
    }
}

export class Session {
    public static async getSession(sessionId: string) {
        const response = await db.connection.one("SELECT * FROM session WHERE id = $1", [sessionId]);

        if (response.adminid) {
            return new AdminSession(response.id, response.adminid);
        } else if (response.studentid) {
            return new StudentSession(response.id, response.studentid);
        } else {
            throw new Error("Invalid Session Object");
        }
    }

    public static async createSession(userId: string, type: "student" | "admin"): Promise<StudentSession | AdminSession> {
        const sessionId = randomUUID();
        if (type == "student") {
            await db.connection.none(
                `INSERT INTO session (id, studentid)
                VALUES ($1, $2);`,
                [sessionId, userId]
            );
            return new StudentSession(sessionId, userId);
            
        } else if (type == "admin") {
            await db.connection.none(
                `INSERT INTO session (id, adminid)
                VALUES ($1, $2);`,
                [sessionId, userId]
            );
            return new AdminSession(sessionId, userId);
        } else {
            throw new Error("Invalid Session Type");
        }
    }
}
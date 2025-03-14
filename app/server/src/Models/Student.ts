import { randomUUID } from "crypto";
import db from "./database";

export class Student {
    constructor(
        public id: string,
        public username: string,
        private password: string,
        public firstname: string,
        public lastname: string,
        public roomid?: string
    ) {}

    public checkPassword(input: string): boolean {
        return input === this.password;
    }

    public static async getAll() {
        const response = await db.connection.any("SELECT * FROM student");
        const result = response.map((r) => new Student(
            r.id, r.username, r.password, r.firstname, r.lastname, r.roomid
        ));
        console.log(result);
        return result;
    }

    public static async getById(id: string) {
        const response = await db.connection.one("SELECT * FROM student WHERE id = $1", [id]);
        const result = new Student(
            response.id, response.username, response.password, response.firstname, response.lastname, response.roomid
        );
        return result;
    }

    public static async getByUsername(username: string) {
        const response = await db.connection.one("SELECT * FROM student WHERE username = $1", [username]);
        const result = new Student(
            response.id, response.username, response.password, response.firstname, response.lastname, response.roomid
        );
        return result;
    }

    public static async add(student: Student): Promise<Student>;
    public static async add(username: string, password: string, firstname: string, lastname: string): Promise<Student>;
    public static async add(arg1: Student | string, password?: string, firstname?: string, lastname?: string): Promise<Student> {
        const id = randomUUID();        
        if (arg1 instanceof Student) {
            const student = arg1;
            await db.connection.none(
                `INSERT INTO student (id, username, password, firstname, lastname)
                VALUES ($1, $2, $3, $4, $5)`,
                [id, student.username, student.password, student.firstname, student.lastname]
            );
            return student;
        } else if (arg1 && password && firstname && lastname) {
            const username = arg1;
            await db.connection.none(
                `INSERT INTO student (id, username, password, firstname, lastname)
                VALUES ($1, $2, $3, $4, $5)`,
                [id, username, password, firstname, lastname]
            );
            return new Student(
                id, username, password, firstname, lastname
            );
        } else {
            throw new Error("Invalid `Student.add` arguments");
        }
    }
}
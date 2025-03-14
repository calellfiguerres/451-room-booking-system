import db from "./database";

export class Student {
    constructor(
        public id: string,
        public username: string,
        private password: string,
        public firstname: string,
        public lastname: string,
        public roomid: string
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
        console.log("before - student");
        const response = await db.connection.one("SELECT * FROM student WHERE username = $1", [username]);
        console.log(`response: ${response}`);
        console.log("after");
        const result = new Student(
            response.id, response.username, response.password, response.firstname, response.lastname, response.roomid
        );
        return result;
    }
}
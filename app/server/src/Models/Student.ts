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

    public static async getAll() {
        const response = await db.connection.any("SELECT * FROM student");
        const result = response.map((r) => new Student(
            r.id, r.username, r.password, r.firstname, r.lastname, r.roomid
        ));
        console.log(result);
        return result;
    }
}
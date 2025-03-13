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
        const response = await db.connection.any("SELECT * FROM ADMIN");
        const result = response.map((r) => new Admin(
            r.id, r.username, r.password, r.firstname, r.lastname
        ));
        console.log(result);
        return result;
    }
}
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
        console.log(result);
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
            response.id, response.usernae, response.password, response.firstname, response.lastname
        );
        return result;
    }
}
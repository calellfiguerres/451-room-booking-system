import { randomUUID } from "node:crypto";
import db from "./database";
import { Student } from "./Student";

export class RoommateRequest {
    constructor(
        public requestid: string,
        public requesterId: string,
        public requesteeId: string,
        public message: string,
        public sendDate: string,
        public requester?: Pick<Student, "id" | "firstname" | "lastname">,
        public requestee?: Pick<Student, "id" | "firstname" | "lastname">
    ) {}

    public static async getAllRoommateRequests() {
        const response = await db.connection.any("SELECT * FROM roommaterequest");
        const result = response.map((r) => new RoommateRequest(
            r.id, r.requesterid, r.requesteeid, r.message, r.senddate
        ));
        return result;
    }

    public static async getRoommateRequests(requesterId: string) {
        const response = await db.connection.any(`
            SELECT
                rr.requestid,
                rr.requesterid,
                rr.requesteeid,
                rr.message,
                rr.senddate,
                s1.firstname AS requesterfirstname,
                s1.lastname AS requesterlastname,
                s2.firstname AS requesteefirstname,
                s2.lastname AS requesteelastname
            FROM roommaterequest rr
            LEFT JOIN student s1 ON rr.requesterid = s1.id
            LEFT JOIN student s2 ON rr.requesteeid = s2.id
            WHERE
                rr.requesterid = $1
                OR rr.requesteeid = $1;
            `, [requesterId]);
        const result = response.map((r) => new RoommateRequest(
            r.requestid,
            r.requesterid,
            r.requesteeid,
            r.message,
            r.senddate,
            { id: r.requesterid, firstname: r.requesterfirstname, lastname: r.requesterlastname },
            { id: r.requesteeid, firstname: r.requesteefirstname, lastname: r.requesteelastname }
        ));
        return result;
    }

    public static async addRoommateRequest(requesterId: string, requesteeId: string, message: string, senddate: string) {
        const id = randomUUID();
        await db.connection.none(
            `INSERT INTO roommaterequest (requestid, requesterid, requesteeid, message, senddate)
            VALUES ($1, $2, $3, $4, $5)`,
            [id, requesterId, requesteeId, message, senddate]
        );
    }

    public static async sendNotification(requesterId: string, requesteeId: string) {
        // Send to requester
        const id1 = randomUUID();
        await db.connection.none(
            `INSERT INTO notifications (id, studentid, content)
            VALUES ($1, $2, $3)`,
            [id1, requesterId, `You have sent a roommate request to ${requesteeId}`]
        );

        // Send to requestee
        const id2 = randomUUID();
        await db.connection.none(
            `INSERT INTO notifications (id, studentid, content)
            VALUES ($1, $2, $3)`,
            [id2, requesteeId, `You have received a roommate request from ${requesterId}`]
        );
    }
}
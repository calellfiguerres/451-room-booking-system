import pgPromise from 'pg-promise';

const pgp = pgPromise();
const db = { connection: pgp({}) }

console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD)

/** Connect to the PostgreSQL database. */
export function connect() {
    db.connection = pgp({
        host    :        process.env.DB_HOST    ,
        port    : Number(process.env.DB_PORT    ),
        database:        process.env.DB_NAME    ,
        user    :        process.env.DB_USER    ,
        password:        process.env.DB_PASSWORD,
    })
    
    db.connection.any('SELECT 1;')
        .then(() => {
            console.log('Connected to PostgreSQL');
        })
        .catch(error => {
            console.error(error);
        });
}

connect();

export default db;
export { pgp }; // Export pgp for sql usage

import * as mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
    connectTimeout: 10000,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;
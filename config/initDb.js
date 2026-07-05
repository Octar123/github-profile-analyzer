import pool from "./db.js";
import * as dotenv from "dotenv";

dotenv.config();

export const initializeDB = async () => {
  try {
    console.log("Connecting to Database");

    await pool.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`,
    );

    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS \`${process.env.DB_NAME}\`.analyzed_profiles (
            id INT UNSIGNED PRIMARY KEY,
            username VARCHAR(40) NOT NULL UNIQUE,
            display_name VARCHAR(150),
            avatar_url VARCHAR(255),
            html_url VARCHAR(255),

            email VARCHAR(254) DEFAULT NULL,
            company VARCHAR(255) DEFAULT NULL,
            location VARCHAR(255) DEFAULT NULL,
            bio TEXT,


            public_repos INT UNSIGNED DEFAULT 0,
            public_gists INT UNSIGNED DEFAULT 0,
            followers INT UNSIGNED DEFAULT 0,
            following INT UNSIGNED DEFAULT 0,

            top_languages JSON,
            profile_created_at TIMESTAMP NULL,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            `);
            
        console.log("Database connected");
            
        } catch (err) {
            console.error("Database initialization failed:", err);
        throw err;
    }
};

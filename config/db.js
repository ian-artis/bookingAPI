import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

/*
  Creates a PostgreSQL connection pool.
  - A pool allows multiple queries without reconnecting each time.
  - Environment variables keep credentials secure.
*/
/* remove comment to user local postgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
    
});
*/
// add comment if local postgreSQL will be used
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});



// Test connection
pool.connect()
  .then(() => console.log("[/] Connected to PostgreSQL"))
  .catch(err => console.error("[X] Database connection error:", err.message));


// Export so controllers can run SQL queries.
export default pool;
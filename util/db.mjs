import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.CONNECTION_STRING;

const connectionPool = new pg.Pool({
  connectionString: connectionString,
});

export default connectionPool;
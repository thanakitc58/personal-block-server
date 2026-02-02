import "dotenv/config";
import * as pg from "pg";

const { Pool } = pg.default;

// local: ใช้จาก .env | Vercel: ตั้ง CONNECTION_STRING ใน Project Settings → Environment Variables
const connectionString = process.env.CONNECTION_STRING;

const connectionPool = new Pool({
  connectionString,
  ssl: connectionString?.includes("supabase") ? { rejectUnauthorized: false } : undefined,
});

export default connectionPool;
import "dotenv/config";
import * as pg from "pg";

const { Pool } = pg.default;

// local: ใส่ CONNECTION_STRING ใน .env
// Vercel: ใส่ CONNECTION_STRING ใน Project Settings → Environment Variables (ใช้ Connection pooling จาก Supabase พอร์ต 6543)
const connectionString =
  process.env.CONNECTION_STRING ||
  "postgresql://postgres:0994672558Za@db.vzteohhdvktixczlyjan.supabase.co:5432/postgres";

const isSupabase = connectionString.includes("supabase");
const isVercel = process.env.VERCEL === "1";

const connectionPool = new Pool({
  connectionString,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
  max: isVercel ? 2 : 10,
});

export default connectionPool;
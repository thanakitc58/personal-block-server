import "dotenv/config";
import * as pg from "pg";

const { Pool } = pg.default;

// const connectionPool = new Pool({
//   connectionString: "postgresql://postgres:0994672558Za@db.vzteohhdvktixczlyjan.supabase.co:5432/postgres",
// });

const connectionPool = new Pool({
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  user: 'postgres.vzteohhdvktixczlyjan',
  password: '0994672558Za',
  port: 6543,
  database: 'postgres',
  pool_mode: 'transaction',
})

export default connectionPool;
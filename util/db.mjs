
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  // ตรงนี้ต้องเปลี่ยน connectionString เป็นของตัวเองด้วยนะ
  connectionString:
  "postgresql://postgres:0994672558Za@db.vzteohhdvktixczlyjan.supabase.co:5432/postgres",

});

export default connectionPool;
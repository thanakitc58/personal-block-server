import connectionPool from "../util/db.mjs";

export async function getAllStatuses() {
  const { rows } = await connectionPool.query(
    "SELECT id, status FROM statuses ORDER BY id ASC"
  );
  return rows;
}

import connectionPool from "../util/db.mjs";

export async function getAllCategories() {
  const { rows } = await connectionPool.query(
    "SELECT id, name FROM categories ORDER BY name ASC"
  );
  return rows;
}

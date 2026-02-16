import connectionPool from "../util/db.mjs";

export async function getAllCategories() {
  const { rows } = await connectionPool.query(
    "SELECT id, name FROM categories ORDER BY name ASC"
  );
  return rows;
}

export async function createCategory(name) {
  const { rows } = await connectionPool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING id, name",
    [name.trim()]
  );
  return rows[0];
}

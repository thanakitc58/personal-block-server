import connectionPool from "../util/db.mjs";

export async function findByUsername(username) {
  const query = `
    SELECT *
    FROM users
    WHERE username = $1
  `;
  const values = [username];
  const { rows } = await connectionPool.query(query, values);
  return rows;
}

export async function createUser({ id, username, name, role }) {
  const query = `
    INSERT INTO users (id, username, name, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [id, username, name, role];
  const { rows } = await connectionPool.query(query, values);
  return rows[0];
}

export async function findById(id) {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1
  `;
  const values = [id];
  const { rows } = await connectionPool.query(query, values);
  return rows[0] || null;
}


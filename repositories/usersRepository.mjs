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

export async function updateProfilePic(userId, profilePicUrl) {
  const query = `
    UPDATE users
    SET profile_pic = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [profilePicUrl, userId];
  const { rows } = await connectionPool.query(query, values);
  return rows[0] || null;
}

export async function updateProfileInfo(userId, { name, username }) {
  const updates = [];
  const values = [];
  let i = 1;
  if (name !== undefined) {
    updates.push(`name = $${i++}`);
    values.push(name);
  }
  if (username !== undefined) {
    updates.push(`username = $${i++}`);
    values.push(username);
  }
  if (updates.length === 0) return findById(userId);
  values.push(userId);
  const query = `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE id = $${i}
    RETURNING *;
  `;
  const { rows } = await connectionPool.query(query, values);
  return rows[0] || null;
}

export async function findByIdNotEqual(id, username) {
  const query = `
    SELECT id FROM users
    WHERE username = $1 AND id != $2
  `;
  const { rows } = await connectionPool.query(query, [username, id]);
  return rows;
}


import connectionPool from "../util/db.mjs";

/**
 * user_notifications table (สร้างด้วย):
 * CREATE TABLE IF NOT EXISTS user_notifications (
 *   id SERIAL PRIMARY KEY,
 *   user_id INT NOT NULL REFERENCES users(id),
 *   type VARCHAR(50) NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   payload JSONB
 * );
 */

export async function getDistinctCommenterUserIdsOnPost(postId, excludeUserId) {
  const { rows } = await connectionPool.query(
    `SELECT DISTINCT user_id FROM comments WHERE post_id = $1 AND user_id != $2`,
    [postId, excludeUserId]
  );
  return rows.map((r) => r.user_id);
}

export async function insertUserNotification(userId, type, payload) {
  const { rows } = await connectionPool.query(
    `INSERT INTO user_notifications (user_id, type, payload)
     VALUES ($1, $2, $3::jsonb)
     RETURNING id, user_id, type, created_at, payload`,
    [userId, type, JSON.stringify(payload)]
  );
  return rows[0];
}

export async function getNotificationsForUser(userId, limit = 30) {
  const query = `
    SELECT id, user_id, type, created_at, payload
    FROM user_notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2
  `;
  const { rows } = await connectionPool.query(query, [userId, limit]);
  return rows;
}

export async function getRecentPostsAsNotifications(limit = 10) {
  const { rows } = await connectionPool.query(
    `SELECT id, title, date FROM posts
     WHERE date > NOW() - INTERVAL '7 days'
     ORDER BY date DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

import connectionPool from "../util/db.mjs";

/**
 * Add a like: insert into likes and increment posts.likes_count.
 * Returns true if a new row was inserted, false if already liked (one like per user per post).
 */
export async function addLike(userId, postId) {
  const already = await hasLiked(userId, postId);
  if (already) return false;
  const client = await connectionPool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userId, postId]
    );
    await client.query(
      `UPDATE posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = $1`,
      [postId]
    );
    await client.query("COMMIT");
    return true;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Remove a like: delete from likes and decrement posts.likes_count.
 */
export async function removeLike(userId, postId) {
  const client = await connectionPool.connect();
  try {
    await client.query("BEGIN");
    const deleteResult = await client.query(
      `DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING user_id`,
      [userId, postId]
    );
    const deleted = deleteResult.rowCount > 0;
    if (deleted) {
      await client.query(
        `UPDATE posts SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = $1`,
        [postId]
      );
    }
    await client.query("COMMIT");
    return deleted;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Check if the user has liked the post.
 */
export async function hasLiked(userId, postId) {
  const { rows } = await connectionPool.query(
    `SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );
  return rows.length > 0;
}

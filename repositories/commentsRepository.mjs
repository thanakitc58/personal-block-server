import connectionPool from "../util/db.mjs";

/**
 * Get all comments for a post, with user name and profile_pic.
 * Assumes comments table: id, post_id, user_id, content, created_at
 * and users table: id, name, profile_pic
 */
export async function getCommentsByPostId(postId) {
  const query = `
    SELECT comments.id,
           comments.post_id,
           comments.user_id,
           comments.content,
           comments.created_at,
           users.name AS author_name,
           users.profile_pic AS author_avatar
    FROM comments
    INNER JOIN users ON users.id = comments.user_id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at ASC
  `;
  const { rows } = await connectionPool.query(query, [postId]);
  return rows;
}

/**
 * Create a comment. Returns the new comment with author info.
 */
export async function createComment({ postId, userId, content }) {
  const query = `
    INSERT INTO comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, post_id, user_id, content, created_at
  `;
  const { rows } = await connectionPool.query(query, [postId, userId, content]);
  const comment = rows[0];
  if (!comment) return null;

  const userQuery = `
    SELECT name AS author_name, profile_pic AS author_avatar
    FROM users WHERE id = $1
  `;
  const { rows: userRows } = await connectionPool.query(userQuery, [userId]);
  const user = userRows[0] || {};
  return {
    id: comment.id,
    post_id: comment.post_id,
    user_id: comment.user_id,
    content: comment.content,
    created_at: comment.created_at,
    author_name: user.author_name,
    author_avatar: user.author_avatar,
  };
}

import connectionPool from "../util/db.mjs";

/**
 * Get all notifications: comments and likes on posts.
 * Each row: type ('comment'|'like'), id, user (name, profile_pic), post_id, post title, optional comment text, created_at.
 * likes table ต้องมีคอลัมน์ created_at (ถ้ายังไม่มี: ALTER TABLE likes ADD COLUMN created_at TIMESTAMP DEFAULT NOW();)
 */
export async function getNotifications() {
  const commentQuery = `
    SELECT
      c.id,
      'comment' AS type,
      c.post_id AS article_id,
      c.comment_text AS comment,
      c.created_at,
      u.name AS user_name,
      u.profile_pic AS user_avatar,
      p.title AS article_title
    FROM comments c
    INNER JOIN users u ON u.id = c.user_id
    INNER JOIN posts p ON p.id = c.post_id
    ORDER BY c.created_at DESC
  `;

  let likeRows = [];
  try {
    const likeQuery = `
      SELECT
        l.user_id,
        l.post_id,
        u.name AS user_name,
        u.profile_pic AS user_avatar,
        p.title AS article_title
      FROM likes l
      INNER JOIN users u ON u.id = l.user_id
      INNER JOIN posts p ON p.id = l.post_id
    `;
    const likeResult = await connectionPool.query(likeQuery);
    likeRows = likeResult.rows;
  } catch (e) {
    console.warn("Could not load like notifications:", e.message);
  }

  const commentResult = await connectionPool.query(commentQuery);
  const commentRows = commentResult.rows.map((r) => ({
    id: `c-${r.id}`,
    type: "comment",
    articleId: r.article_id,
    articleTitle: r.article_title,
    comment: r.comment,
    createdAt: r.created_at,
    user: { name: r.user_name, avatar: r.user_avatar },
  }));

  const likeNotifications = likeRows.map((r, idx) => ({
    id: `l-${r.user_id}-${r.post_id}-${idx}`,
    type: "like",
    articleId: r.post_id,
    articleTitle: r.article_title,
    createdAt: null,
    user: { name: r.user_name, avatar: r.user_avatar },
  }));

  const merged = [...commentRows, ...likeNotifications].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
  return merged;
}

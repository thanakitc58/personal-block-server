import connectionPool from "../util/db.mjs";

/**
 * ดึงการแจ้งเตือนจาก comments และ posts โดยตรง ไม่ใช้ตาราง user_notifications
 * (1) โพสใหม่ 7 วันล่าสุด
 * (2) comment ล่าสุดในโพสที่ user นี้เคย comment (ที่ไม่ได้เป็น comment ของตัวเอง)
 */

export async function getRecentPostsAsNotifications(limit = 10) {
  const { rows } = await connectionPool.query(
    `SELECT id, title, date FROM posts
     WHERE date > NOW() - INTERVAL '7 days'
     ORDER BY date DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

/**
 * ดึง comments ในโพสที่ user นี้เคย comment (ไม่รวม comment ของตัวเอง)
 * เรียงตาม created_at ล่าสุด
 */
export async function getCommentsOnPostsICommentedOn(userId, limit = 30) {
  const query = `
    SELECT
      c.id AS comment_id,
      c.post_id,
      c.user_id AS commenter_id,
      c.created_at,
      u.name AS commenter_name,
      u.profile_pic AS commenter_avatar,
      p.title AS post_title
    FROM comments c
    INNER JOIN users u ON u.id = c.user_id
    INNER JOIN posts p ON p.id = c.post_id
    WHERE c.post_id IN (
      SELECT DISTINCT post_id FROM comments WHERE user_id = $1
    )
    AND c.user_id != $1
    ORDER BY c.created_at DESC
    LIMIT $2
  `;
  const { rows } = await connectionPool.query(query, [userId, limit]);
  return rows;
}

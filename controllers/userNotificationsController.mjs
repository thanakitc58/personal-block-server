import {
  getRecentPostsAsNotifications,
  getCommentsOnPostsICommentedOn,
} from "../repositories/userNotificationsRepository.mjs";

/**
 * GET /auth/notifications - สำหรับ user ที่ login แล้ว
 * ดึงตาม post id โดยตรง ไม่ใช้ตารางใหม่:
 * (1) โพสใหม่ 7 วันล่าสุด → "Published new article."
 * (2) comment ในโพสที่เราเคย comment (ดึงจาก comments ตาม post_id) → "Comment on the article you have commented on."
 */
export async function handleGetMyNotifications(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const [recentPosts, commentRows] = await Promise.all([
      getRecentPostsAsNotifications(10),
      getCommentsOnPostsICommentedOn(userId, 30),
    ]);
    const list = [];
    for (const row of commentRows) {
      list.push({
        id: `c-${row.comment_id}`,
        type: "comment_on_my_thread",
        createdAt: row.created_at,
        user: {
          name: row.commenter_name,
          avatar: row.commenter_avatar,
        },
        postId: row.post_id,
        postTitle: row.post_title,
      });
    }
    for (const p of recentPosts) {
      list.push({
        id: `p-${p.id}`,
        type: "new_article",
        createdAt: p.date,
        user: { name: "Admin", avatar: null },
        postId: p.id,
        postTitle: p.title,
      });
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const notifications = list.slice(0, 30);
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Get my notifications error:", error.message);
    return res.status(500).json({ error: "Failed to get notifications" });
  }
}

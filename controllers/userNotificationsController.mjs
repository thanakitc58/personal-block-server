import {
  getNotificationsForUser,
  getRecentPostsAsNotifications,
} from "../repositories/userNotificationsRepository.mjs";

/**
 * GET /auth/notifications - สำหรับ user ที่ login แล้ว
 * คืน: (1) admin โพสบทความใหม่ - จากโพส 7 วันล่าสุด
 *      (2) user อื่น comment ในโพสที่เราเคย comment - จาก user_notifications
 */
export async function handleGetMyNotifications(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const [storedRows, recentPosts] = await Promise.all([
      getNotificationsForUser(userId, 30),
      getRecentPostsAsNotifications(10),
    ]);
    const list = [];
    for (const row of storedRows) {
      const payload = row.payload || {};
      list.push({
        id: `n-${row.id}`,
        type: row.type,
        createdAt: row.created_at,
        user: {
          name: payload.commenter_name,
          avatar: payload.commenter_avatar,
        },
        postId: payload.post_id,
        postTitle: payload.post_title,
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

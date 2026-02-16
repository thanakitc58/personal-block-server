import { getNotifications } from "../repositories/notificationsRepository.mjs";

export async function handleGetNotifications(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 6));
    const all = await getNotifications();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const notifications = all.slice(offset, offset + limit);
    return res.status(200).json({
      notifications,
      currentPage: safePage,
      totalPages,
      total,
    });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ error: "Failed to get notifications" });
  }
}

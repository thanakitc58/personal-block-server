import { getNotifications } from "../repositories/notificationsRepository.mjs";

export async function handleGetNotifications(req, res) {
  try {
    const notifications = await getNotifications();
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json({ error: "Failed to get notifications" });
  }
}

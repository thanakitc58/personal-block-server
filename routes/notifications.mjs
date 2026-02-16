import express from "express";
import { handleGetNotifications } from "../controllers/notificationsController.mjs";

const router = express.Router();
router.get("/", handleGetNotifications);

export default router;

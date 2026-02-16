import { Router } from "express";
import {
  register,
  login,
  getUser,
  handleResetPassword,
  handleUpdateProfile,
  handleUpdateProfileInfo,
} from "../controllers/authController.mjs";
import { handleGetMyNotifications } from "../controllers/userNotificationsController.mjs";
import uploadAvatar from "../middleware/uploadAvatar.mjs";
import protectUser from "../middleware/protectUser.mjs";

const authRouter = Router();

// Routes: URL + middlewares + controllers
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/get-user", getUser);
authRouter.get("/notifications", protectUser, handleGetMyNotifications);
authRouter.put("/reset-password", handleResetPassword);
authRouter.patch("/profile", handleUpdateProfileInfo);
authRouter.put("/profile", (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, handleUpdateProfile);

export default authRouter;

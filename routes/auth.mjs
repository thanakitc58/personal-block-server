import { Router } from "express";
import {
  register,
  login,
  getUser,
  handleResetPassword,
  handleUpdateProfile,
  handleUpdateProfileInfo,
} from "../controllers/authController.mjs";
import uploadAvatar from "../middleware/uploadAvatar.mjs";

const authRouter = Router();

// Routes: URL + middlewares + controllers
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/get-user", getUser);
authRouter.put("/reset-password", handleResetPassword);
authRouter.patch("/profile", handleUpdateProfileInfo);
authRouter.put("/profile", (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, handleUpdateProfile);

export default authRouter;

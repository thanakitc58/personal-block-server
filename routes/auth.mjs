import { Router } from "express";
import {
  register,
  login,
  getUser,
  handleResetPassword,
} from "../controllers/authController.mjs";

const authRouter = Router();

// Routes: URL + middlewares + controllers
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/get-user", getUser);
authRouter.put("/reset-password", handleResetPassword);

export default authRouter;

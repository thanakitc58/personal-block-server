import "dotenv/config";
import express from "express";
import cors from "cors";
import postsRouter from "./routers/posts.mjs";
import authRouter from "./routes/auth.mjs";
import protectUser from "./middleware/protectUser.mjs";
import protectAdmin from "./middleware/protectAdmin.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "http://localhost:3000", // Frontend local (React อื่นๆ)
      "https://dog-block-bark.vercel.app", // Frontend ที่ deploy แล้ว
      "https://dog-block-bark-git-dev-pongzaps-projects.vercel.app",
    ],
  })
);
app.use(express.json());

app.use("/posts", postsRouter);
app.use("/auth", authRouter);

// Protected routes - require authentication
app.get("/protected-route", protectUser, (req, res) => {
  res.json({ message: "This is protected content", user: req.user });
});

// Admin-only routes - require admin role
app.get("/admin-only", protectAdmin, (req, res) => {
  res.json({ message: "This is admin-only content", admin: req.user });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

export default app;

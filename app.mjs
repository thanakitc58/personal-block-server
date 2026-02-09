import "dotenv/config";
import express from "express";
import cors from "cors";
import postsRouter from "./routers/posts.mjs";
import authRouter from "./routes/auth.mjs";

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

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

export default app;

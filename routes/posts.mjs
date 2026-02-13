import express from "express";
import validatePostData from "../middleware/postValidation.mjs";
import {
  handleCreatePost,
  handleGetPosts,
  handleGetPostById,
  handleUpdatePost,
  handleDeletePost,
} from "../controllers/postsController.mjs";

const router = express.Router();

// Routes: URL + middlewares + controllers
router.post("/", validatePostData, handleCreatePost);
router.get("/", handleGetPosts);
router.get("/:postId", handleGetPostById);
router.put("/:postId", validatePostData, handleUpdatePost);
router.delete("/:postId", handleDeletePost);

export default router;

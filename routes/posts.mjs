import express from "express";
import validatePostData from "../middleware/postValidation.mjs";
import protectUser from "../middleware/protectUser.mjs";
import {
  handleCreatePost,
  handleGetPosts,
  handleGetPostById,
  handleUpdatePost,
  handleDeletePost,
  handleLikePost,
  handleUnlikePost,
  handleGetLikeStatus,
} from "../controllers/postsController.mjs";

const router = express.Router();

// Routes: URL + middlewares + controllers
router.post("/", validatePostData, handleCreatePost);
router.get("/", handleGetPosts);
// Like routes (more specific) before /:postId
router.get("/:postId/like", protectUser, handleGetLikeStatus);
router.post("/:postId/like", protectUser, handleLikePost);
router.delete("/:postId/like", protectUser, handleUnlikePost);
router.get("/:postId", handleGetPostById);
router.put("/:postId", validatePostData, handleUpdatePost);
router.delete("/:postId", handleDeletePost);

export default router;

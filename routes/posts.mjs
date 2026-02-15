import express from "express";
import validatePostData from "../middleware/postValidation.mjs";
import protectUser from "../middleware/protectUser.mjs";
import uploadPostImage from "../middleware/uploadPostImage.mjs";
import {
  handleCreatePost,
  handleGetPosts,
  handleGetPostById,
  handleUpdatePost,
  handleDeletePost,
  handleLikePost,
  handleUnlikePost,
  handleGetLikeStatus,
  handleGetComments,
  handleCreateComment,
  handleGetCategories,
  handleGetStatuses,
  handleUploadPostImage,
} from "../controllers/postsController.mjs";

const router = express.Router();

// Routes: URL + middlewares + controllers
router.post("/", validatePostData, handleCreatePost);
router.get("/", handleGetPosts);
router.get("/categories", handleGetCategories);
router.get("/statuses", handleGetStatuses);
router.post("/upload-image", (req, res, next) => {
  uploadPostImage(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, handleUploadPostImage);
// Like routes (more specific) before /:postId
router.get("/:postId/like", protectUser, handleGetLikeStatus);
router.post("/:postId/like", protectUser, handleLikePost);
router.delete("/:postId/like", protectUser, handleUnlikePost);
// Comment routes
router.get("/:postId/comments", handleGetComments);
router.post("/:postId/comments", protectUser, handleCreateComment);
router.get("/:postId", handleGetPostById);
router.put("/:postId", validatePostData, handleUpdatePost);
router.delete("/:postId", handleDeletePost);

export default router;

import {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getLikeStatus,
} from "../services/postsService.mjs";
import {
  getCommentsByPostId,
  createComment,
} from "../repositories/commentsRepository.mjs";

export async function handleCreatePost(req, res) {
  const newPost = req.body;

  try {
    await createPost(newPost);
    return res.status(201).json({ message: "Created post successfully" });
  } catch {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
}

export async function handleGetPosts(req, res) {
  try {
    const category = req.query.category || "";
    const keyword = req.query.keyword || "";
    const page = req.query.page;
    const limit = req.query.limit;

    const results = await listPosts({ category, keyword, page, limit });
    return res.status(200).json(results);
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database issue",
    });
  }
}

export async function handleGetPostById(req, res) {
  const postIdFromClient = req.params.postId;

  try {
    const post = await getPostById(postIdFromClient);

    if (!post) {
      return res.status(404).json({
        message: `Server could not find a requested post (post id: ${postIdFromClient})`,
      });
    }

    return res.status(200).json({
      data: post,
    });
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database issue",
    });
  }
}

export async function handleUpdatePost(req, res) {
  const postIdFromClient = req.params.postId;
  const updatedPost = req.body;

  try {
    await updatePost(postIdFromClient, updatedPost);

    return res.status(200).json({
      message: "Updated post successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
}

export async function handleDeletePost(req, res) {
  const postIdFromClient = req.params.postId;

  try {
    await deletePost(postIdFromClient);

    return res.status(200).json({
      message: "Deleted post successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "Server could not delete post because database connection",
    });
  }
}

export async function handleLikePost(req, res) {
  const postId = req.params.postId;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const result = await likePost(userId, postId);
    const postAfter = await getPostById(postId);
    return res.status(200).json({
      liked: true,
      count: postAfter?.likes_count ?? 0,
      alreadyLiked: result.alreadyLiked,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to like post" });
  }
}

export async function handleUnlikePost(req, res) {
  const postId = req.params.postId;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    await unlikePost(userId, postId);
    const postAfter = await getPostById(postId);
    return res.status(200).json({
      liked: false,
      count: postAfter?.likes_count ?? 0,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to unlike post" });
  }
}

export async function handleGetLikeStatus(req, res) {
  const postId = req.params.postId;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const status = await getLikeStatus(userId, postId);
    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get like status" });
  }
}

export async function handleGetComments(req, res) {
  const postId = req.params.postId;
  try {
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comments = await getCommentsByPostId(postId);
    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Get comments error:", error.message);
    return res.status(500).json({
      error: "Failed to get comments",
      detail: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
}

export async function handleCreateComment(req, res) {
  const postId = req.params.postId;
  const userId = req.user?.id;
  const { content } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Comment content is required" });
  }

  try {
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const comment = await createComment({
      postId,
      userId,
      content: content.trim(),
    });
    return res.status(201).json({ comment });
  } catch (error) {
    console.error("Create comment error:", error.message);
    return res.status(500).json({
      error: "Failed to create comment",
      detail: process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
}


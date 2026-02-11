import {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../services/postsService.mjs";

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


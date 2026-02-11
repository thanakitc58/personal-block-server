import {
  createPost as createPostInRepo,
  getPosts as getPostsFromRepo,
  countPosts as countPostsInRepo,
  getPostById as getPostByIdFromRepo,
  updatePost as updatePostInRepo,
  deletePost as deletePostInRepo,
} from "../repositories/postsRepository.mjs";

export async function createPost(postData) {
  await createPostInRepo(postData);
}

export async function listPosts({ category, keyword, page, limit }) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 6));
  const offset = (safePage - 1) * safeLimit;

  const [posts, totalPosts] = await Promise.all([
    getPostsFromRepo({ category, keyword, limit: safeLimit, offset }),
    countPostsInRepo({ category, keyword }),
  ]);

  const results = {
    totalPosts,
    totalPages: Math.ceil(totalPosts / safeLimit),
    currentPage: safePage,
    limit: safeLimit,
    posts,
  };

  if (offset + safeLimit < totalPosts) {
    results.nextPage = safePage + 1;
  }
  if (offset > 0) {
    results.previousPage = safePage - 1;
  }

  return results;
}

export async function getPostById(postId) {
  const post = await getPostByIdFromRepo(postId);
  return post;
}

export async function updatePost(postId, postData) {
  const updatedPost = { ...postData, date: new Date() };
  await updatePostInRepo(postId, updatedPost);
}

export async function deletePost(postId) {
  await deletePostInRepo(postId);
}


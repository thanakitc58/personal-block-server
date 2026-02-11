import connectionPool from "../util/db.mjs";

export async function createPost(post) {
  const query = `
    INSERT INTO posts (title, image, category_id, description, content, status_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const values = [
    post.title,
    post.image,
    post.category_id,
    post.description,
    post.content,
    post.status_id,
  ];

  await connectionPool.query(query, values);
}

export async function getPosts({ category, keyword, limit, offset }) {
  let query = `
    SELECT posts.id,
           posts.image,
           categories.name AS category,
           posts.title,
           posts.description,
           posts.date,
           posts.content,
           statuses.status,
           posts.likes_count
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
  `;

  let values = [];

  if (category && keyword) {
    query += `
      WHERE categories.name ILIKE $1
        AND (posts.title ILIKE $2
          OR posts.description ILIKE $2
          OR posts.content ILIKE $2)
    `;
    values = [`%${category}%`, `%${keyword}%`];
  } else if (category) {
    query += " WHERE categories.name ILIKE $1";
    values = [`%${category}%`];
  } else if (keyword) {
    query += `
      WHERE posts.title ILIKE $1
         OR posts.description ILIKE $1
         OR posts.content ILIKE $1
    `;
    values = [`%${keyword}%`];
  }

  query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

  values.push(limit, offset);

  const result = await connectionPool.query(query, values);
  return result.rows;
}

export async function countPosts({ category, keyword }) {
  let query = `
    SELECT COUNT(*)
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
  `;

  let values = [];

  if (category && keyword) {
    query += `
      WHERE categories.name ILIKE $1
        AND (posts.title ILIKE $2
          OR posts.description ILIKE $2
          OR posts.content ILIKE $2)
    `;
    values = [`%${category}%`, `%${keyword}%`];
  } else if (category) {
    query += " WHERE categories.name ILIKE $1";
    values = [`%${category}%`];
  } else if (keyword) {
    query += `
      WHERE posts.title ILIKE $1
         OR posts.description ILIKE $1
         OR posts.content ILIKE $1
    `;
    values = [`%${keyword}%`];
  }

  const result = await connectionPool.query(query, values);
  return parseInt(result.rows[0].count, 10);
}

export async function getPostById(postId) {
  const query = `
    SELECT posts.id,
           posts.image,
           categories.name AS category,
           posts.title,
           posts.description,
           posts.date,
           posts.content,
           statuses.status,
           posts.likes_count
    FROM posts
    INNER JOIN categories ON posts.category_id = categories.id
    INNER JOIN statuses ON posts.status_id = statuses.id
    WHERE posts.id = $1
  `;

  const { rows } = await connectionPool.query(query, [postId]);
  return rows[0] || null;
}

export async function updatePost(postId, updatedPost) {
  const query = `
    UPDATE posts
    SET title = $2,
        image = $3,
        category_id = $4,
        description = $5,
        content = $6,
        status_id = $7,
        date = $8
    WHERE id = $1
  `;

  const values = [
    postId,
    updatedPost.title,
    updatedPost.image,
    updatedPost.category_id,
    updatedPost.description,
    updatedPost.content,
    updatedPost.status_id,
    updatedPost.date,
  ];

  await connectionPool.query(query, values);
}

export async function deletePost(postId) {
  const query = `
    DELETE FROM posts
    WHERE id = $1
  `;

  await connectionPool.query(query, [postId]);
}


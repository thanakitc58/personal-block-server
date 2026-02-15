import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const BUCKET = "my-personal-block";

/**
 * Upload file buffer to Supabase Storage and return public URL.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - e.g. image/jpeg
 * @param {string} folder - e.g. "posts"
 * @returns {Promise<string>} Public URL
 */
export async function uploadToStorage(buffer, mimetype, folder = "posts") {
  const ext = mimetype?.split("/")[1] || "jpg";
  const filePath = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
    contentType: mimetype,
    upsert: true,
  });

  if (error) throw new Error(error.message || "Upload failed");

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return publicUrl;
}

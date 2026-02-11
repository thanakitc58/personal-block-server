import { createClient } from "@supabase/supabase-js";
import { findByUsername, createUser, findById } from "../repositories/usersRepository.mjs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function createServiceError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function registerUser({ email, password, username, name }) {
  const existingUser = await findByUsername(username);
  if (existingUser.length > 0) {
    throw createServiceError(400, "This username is already taken");
  }

  const { data, error: supabaseError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (supabaseError) {
    if (supabaseError.code === "user_already_exists") {
      throw createServiceError(
        400,
        "User with this email already exists"
      );
    }
    throw createServiceError(
      400,
      "Failed to create user. Please try again."
    );
  }

  const supabaseUserId = data.user.id;
  const user = await createUser({
    id: supabaseUserId,
    username,
    name,
    role: "user",
  });

  return user;
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message.includes("Invalid login credentials")
    ) {
      throw createServiceError(
        400,
        "Your password is incorrect or this email doesn't exist"
      );
    }
    throw createServiceError(400, error.message);
  }

  return {
    accessToken: data.session.access_token,
  };
}

export async function getUserFromToken(token) {
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    throw createServiceError(401, "Unauthorized or token expired");
  }

  const supabaseUserId = data.user.id;
  const userRow = await findById(supabaseUserId);

  if (!userRow) {
    throw createServiceError(404, "User not found");
  }

  return {
    id: data.user.id,
    email: data.user.email,
    username: userRow.username,
    name: userRow.name,
    role: userRow.role,
    profilePic: userRow.profile_pic,
  };
}

export async function resetPassword({ token, oldPassword, newPassword }) {
  const { data: userData } = await supabase.auth.getUser(token);

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: oldPassword,
  });

  if (loginError) {
    throw createServiceError(400, "Invalid old password");
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw createServiceError(400, error.message);
  }
}


import {
  registerUser,
  loginUser,
  getUserFromToken,
  resetPassword,
  updateUserProfile,
  updateProfileInfoByToken,
} from "../services/authService.mjs";

export async function register(req, res) {
  const { email, password, username, name } = req.body;

  try {
    const user = await registerUser({ email, password, username, name });
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "An error occurred during registration" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { accessToken } = await loginUser({ email, password });
    return res.status(200).json({
      message: "Signed in successfully",
      access_token: accessToken,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "An error occurred during login" });
  }
}

export async function getUser(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const user = await getUserFromToken(token);
    return res.status(200).json(user);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleResetPassword(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    await resetPassword({ token, oldPassword, newPassword });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleUpdateProfile(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    const user = await updateUserProfile(token, req.file);
    return res.status(200).json({ user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleUpdateProfileInfo(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, username } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const user = await updateProfileInfoByToken(token, { name, username });
    return res.status(200).json({ user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}


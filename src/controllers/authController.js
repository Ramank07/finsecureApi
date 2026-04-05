import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // ✅ 2. Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }
  const userCount = await User.countDocuments();

  let role = "viewer";

  if (userCount === 0) {
    role = "admin";
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    status: "active"
  });

  res.json({
    message: "User created",
    role: user.role
  });
} catch (error) {
  res.status(500).json({
    message: "Server error"
  });
}
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user.status === "inactive") {
  return res.status(403).json({
    message: "User is inactive"
  });
}
  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.json({ message: "Logged in" });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
import mongoose from "mongoose";
import User from "../models/user.js";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'active' or 'inactive'"
      });
    }

    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: "User status updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const allowedRoles = ["viewer", "analyst", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Must be one of: ${allowedRoles.join(", ")}`
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (req.user.id === id && role !== "admin") {
      return res.status(403).json({
        message: "Cannot downgrade your own admin role"
      });
    }

    if (user.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });

      if (adminCount === 1) {
        return res.status(400).json({
          message: "Cannot remove the last admin from the system"
        });
      }
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");

    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
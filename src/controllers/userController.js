import User from "../models/user.js";

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User status updated successfully",
      user
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

    // ✅ 1. Validate role
    const allowedRoles = ["viewer", "analyst", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // ✅ 2. Check user exists
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (req.user.id === id && role !== "admin") {
      return res.status(400).json({
        message: "Admin cannot downgrade own role"
      });
    }

    if (user.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });

      if (adminCount === 1) {
        return res.status(400).json({
          message: "At least one admin must exist"
        });
      }
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
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
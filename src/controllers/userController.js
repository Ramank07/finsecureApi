import User from "../models/user.js";

export const updateUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  res.json(updatedUser);
};
import express from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { updateUser } from "../controllers/userController.js";

const router = express.Router();

// Only admin can update users
router.patch("/:id", auth, allowRoles("admin"), updateUser);

export default router;
import express from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  updateUserStatus,
  changeUserRole
} from "../controllers/userController.js";

const router = express.Router();

// Only admin can update users
router.patch(
  "/:id/status",
  auth,
  allowRoles("admin"),
  updateUserStatus
);

router.patch(
  "/:id/role",
  auth,
  allowRoles("admin"),
  changeUserRole
);

export default router;
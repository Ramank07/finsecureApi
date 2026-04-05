import express from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  updateUserStatus,
  changeUserRole,
    getAllUsers
} from "../controllers/userController.js";

const router = express.Router();

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

router.get("/", auth, allowRoles("admin"), getAllUsers);

export default router;
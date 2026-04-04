import express from "express";
import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  createRecord,
  getRecords,
  deleteRecord,
} from "../controllers/recordController.js";

const router = express.Router();

router.post("/", auth, allowRoles("admin"), createRecord);
router.get("/", auth, allowRoles("admin", "analyst", "viewer"), getRecords);
router.delete("/:id", auth, allowRoles("admin"), deleteRecord);

export default router;
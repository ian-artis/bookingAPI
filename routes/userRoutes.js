import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserActive,
  deleteUser
} from "../controllers/userController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/*
 Admin-only user management routes.
 */
router.post("/", verifyToken, requireAdmin, createUser);
router.get("/", verifyToken, requireAdmin, getAllUsers);
router.get("/:id", verifyToken, requireAdmin, getUserById);
router.put("/:id", verifyToken, requireAdmin, updateUser);
router.patch("/:id/toggle", verifyToken, requireAdmin, toggleUserActive);
router.delete("/:id", verifyToken, requireAdmin, deleteUser);

export default router;
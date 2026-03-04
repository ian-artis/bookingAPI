import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  toggleCourseActive,
  deleteCourse
} from "../controllers/courseController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/*
  Admin-only course management routes.
 */
router.post("/", verifyToken, requireAdmin, createCourse);
router.get("/", verifyToken, requireAdmin, getAllCourses);
router.get("/:id", verifyToken, requireAdmin, getCourseById);
router.put("/:id", verifyToken, requireAdmin, updateCourse);
router.patch("/:id/toggle", verifyToken, requireAdmin, toggleCourseActive);
router.delete("/:id", verifyToken, requireAdmin, deleteCourse);

export default router;
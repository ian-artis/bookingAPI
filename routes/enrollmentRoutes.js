import express from "express";
import {
  createEnrollment,
  getAllEnrollments,
  getMyEnrollments,
  deleteEnrollment
} from "../controllers/enrollmentController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/*
  User-only: enroll and view own enrollments.
  Admin-only: view all enrollments, delete enrollment.
 */
router.post("/", verifyToken, createEnrollment);
router.get("/me", verifyToken, getMyEnrollments);
router.get("/", verifyToken, requireAdmin, getAllEnrollments);
router.delete("/:id", verifyToken, requireAdmin, deleteEnrollment);

export default router;
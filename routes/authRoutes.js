import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/*
  Public routes:
  - POST /auth/register
  - POST /auth/login
 */
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
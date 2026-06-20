import express from "express";
import { registerUser, loginUser, logoutUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors,
} from "../middleware/validators.js";

const router = express.Router();

router.post("/register", registerValidationRules, handleValidationErrors, registerUser);
router.post("/login", loginValidationRules, handleValidationErrors, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

export default router;

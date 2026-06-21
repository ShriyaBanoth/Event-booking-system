import express from "express";
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingQRCode,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createBookingValidationRules, handleValidationErrors } from "../middleware/validators.js";

const router = express.Router();

router.use(protect); // every booking route requires authentication

router.post("/", createBookingValidationRules, handleValidationErrors, createBooking);
router.get("/", getUserBookings);
router.get("/:id/qr", getBookingQRCode);
router.delete("/:id", cancelBooking);

export default router;

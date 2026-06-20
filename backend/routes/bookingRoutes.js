import express from "express";
import { createBooking, getUserBookings, cancelBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // every booking route requires authentication

router.post("/", createBooking);
router.get("/", getUserBookings);
router.delete("/:id", cancelBooking);

export default router;

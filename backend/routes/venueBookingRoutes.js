import express from "express";
import {
  createVenueBooking,
  getMyVenueBookings,
  cancelVenueBooking,
} from "../controllers/venueBookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createVenueBooking);
router.get("/", protect, getMyVenueBookings);
router.delete("/:id", protect, cancelVenueBooking);

export default router;
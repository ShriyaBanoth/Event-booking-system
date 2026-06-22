import express from "express";
import {
  createVenueBooking,
  getMyVenueBookings,
} from "../controllers/venueBookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createVenueBooking);
router.get("/", protect, getMyVenueBookings);

export default router;
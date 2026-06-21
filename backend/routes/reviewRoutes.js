import express from "express";
import { createReview, getReviewsByEvent } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/event/:eventId", getReviewsByEvent);

export default router;

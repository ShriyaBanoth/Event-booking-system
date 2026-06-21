import * as reviewService from "../services/reviewService.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { eventId, rating, comment } = req.body;

  const review = await reviewService.createReview({
    userId: req.user._id,
    eventId,
    rating,
    comment,
  });

  res.status(201).json({ success: true, message: "Review created", data: { review } });
});

// @desc    Get reviews for an event
// @route   GET /api/reviews/event/:eventId
// @access  Public
export const getReviewsByEvent = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsByEvent(req.params.eventId);
  res.status(200).json({ success: true, data: { reviews } });
});

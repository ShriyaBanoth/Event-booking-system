import mongoose from "mongoose";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import AppError from "../utils/AppError.js";

export const createReview = async ({ userId, eventId, rating, comment }) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const score = Number(rating);
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new AppError("Rating must be an integer between 1 and 5", 400);
  }

  // Only users who have a confirmed booking for this event may review
  const hasBooking = await Booking.exists({ user: userId, event: eventId, status: "confirmed" });
  if (!hasBooking) {
    throw new AppError("Only users who have booked this event can leave a review", 403);
  }

  // Prevent duplicate reviews (unique index will also protect, but provide friendlier message)
  const already = await Review.exists({ user: userId, event: eventId });
  if (already) {
    throw new AppError("You have already reviewed this event", 400);
  }

  const review = await Review.create({ user: userId, event: eventId, rating: score, comment });

  // Recalculate summary (average and count) for the event and save it
  const agg = await Review.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: "$event",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = agg[0] || { avg: 0, count: 0 };

  await Event.findByIdAndUpdate(eventId, {
    averageRating: Number(summary.avg.toFixed(2)),
    reviewCount: summary.count,
  });

  return Review.findById(review._id).populate("user", "name");
};

export const getReviewsByEvent = async (eventId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const reviews = await Review.find({ event: eventId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return reviews;
};

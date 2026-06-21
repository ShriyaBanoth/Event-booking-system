import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
  },
  { timestamps: true }
);

// Enforce one review per user per event
reviewSchema.index({ user: 1, event: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;

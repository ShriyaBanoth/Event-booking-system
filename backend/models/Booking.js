import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
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
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [1, "Must book at least 1 seat"],
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

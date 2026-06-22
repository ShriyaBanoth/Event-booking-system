import mongoose from "mongoose";

const venueBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VenueBooking", venueBookingSchema);
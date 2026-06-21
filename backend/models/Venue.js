import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    eventTypes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Venue", venueSchema);
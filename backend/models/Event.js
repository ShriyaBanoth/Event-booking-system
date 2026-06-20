import mongoose from "mongoose";

const EVENT_CATEGORIES = [
  "Music",
  "Technology",
  "Sports",
  "Arts & Theatre",
  "Business",
  "Food & Drink",
  "Comedy",
  "Other",
];

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      maxlength: [120, "Event name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      default: "Other",
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: [1, "Total seats must be at least 1"],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, "Available seats cannot be negative"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Keep availableSeats in sync with totalSeats on creation if not explicitly set
eventSchema.pre("validate", function (next) {
  if (this.isNew && (this.availableSeats === undefined || this.availableSeats === null)) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

eventSchema.index({ name: "text", description: "text", venue: "text" });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

const Event = mongoose.model("Event", eventSchema);

export { EVENT_CATEGORIES };
export default Event;

import mongoose from "mongoose";

export const SLOTS = ["morning", "afternoon", "evening"];

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
      min: [1, "At least 1 guest is required"],
    },
    eventType: {
      type: String,
      required: true,
    },
    // The day the venue is reserved for (stored as UTC midnight)
    eventDate: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      enum: SLOTS,
      required: true,
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
    // When the booking was made (kept from the original schema)
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// A venue can have only ONE confirmed booking per date and slot.
// Partial index: cancelled bookings don't block the slot, and old
// bookings (which have no status) are not indexed at all.
venueBookingSchema.index(
  { venue: 1, eventDate: 1, slot: 1 },
  { unique: true, partialFilterExpression: { status: "confirmed" } }
);
venueBookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("VenueBooking", venueBookingSchema);

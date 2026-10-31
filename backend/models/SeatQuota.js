import mongoose from "mongoose";

const seatQuotaSchema = new mongoose.Schema(
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
    // Active (confirmed) seats this user holds for this event
    seats: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// One counter document per (user, event)
seatQuotaSchema.index({ user: 1, event: 1 }, { unique: true });

const SeatQuota = mongoose.model("SeatQuota", seatQuotaSchema);

export default SeatQuota;

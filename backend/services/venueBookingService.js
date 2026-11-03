import mongoose from "mongoose";
import Venue from "../models/Venue.js";
import VenueBooking, { SLOTS } from "../models/VenueBooking.js";
import AppError from "../utils/AppError.js";

const startOfTodayUtc = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const parseEventDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new AppError("Date must be in YYYY-MM-DD format", 400);
  }
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) {
    throw new AppError("That is not a valid date", 400);
  }
  return d;
};

export const createVenueBooking = async ({
  userId,
  venueId,
  guests,
  eventType,
  eventDate,
  slot,
}) => {
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    throw new AppError("Invalid venue ID", 400);
  }

  const guestsRequested = Number(guests);
  if (!Number.isInteger(guestsRequested) || guestsRequested < 1) {
    throw new AppError("Guests must be a whole number of at least 1", 400);
  }

  if (typeof eventType !== "string" || !eventType.trim()) {
    throw new AppError("Please choose an event type", 400);
  }

  if (!SLOTS.includes(slot)) {
    throw new AppError(`Slot must be one of: ${SLOTS.join(", ")}`, 400);
  }

  const date = parseEventDate(eventDate);
  if (date < startOfTodayUtc()) {
    throw new AppError("Please choose a date that is today or later", 400);
  }

  const venue = await Venue.findById(venueId);
  if (!venue) {
    throw new AppError("Venue not found", 404);
  }

  if (guestsRequested > venue.capacity) {
    throw new AppError(
      `This venue holds up to ${venue.capacity} guests. You entered ${guestsRequested}.`,
      400
    );
  }

  try {
    const booking = await VenueBooking.create({
      user: userId,
      venue: venue._id,
      guests: guestsRequested,
      eventType: eventType.trim(),
      eventDate: date,
      slot,
      totalPrice: venue.pricePerDay,
      status: "confirmed",
    });
    return VenueBooking.findById(booking._id).populate("venue");
  } catch (err) {
    // The unique index decided another booking won this venue/date/slot
    if (err.code === 11000) {
      throw new AppError(
        "This venue is already booked for that date and slot. Please choose another.",
        409
      );
    }
    throw err;
  }
};

export const listMyVenueBookings = async (userId) => {
  return VenueBooking.find({ user: userId }).populate("venue").sort({ createdAt: -1 });
};

export const cancelVenueBooking = async ({ bookingId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new AppError("Invalid booking ID", 400);
  }

  // Cancellation closes once the booked date has passed
  const pending = await VenueBooking.findOne({
    _id: bookingId,
    user: userId,
    status: { $ne: "cancelled" },
  });
  if (pending?.eventDate && pending.eventDate < startOfTodayUtc()) {
    throw new AppError("That date has passed, so the booking can no longer be cancelled", 400);
  }

  // Atomic: only ONE concurrent request can flip it to cancelled
  const booking = await VenueBooking.findOneAndUpdate(
    { _id: bookingId, user: userId, status: { $ne: "cancelled" } },
    { status: "cancelled" },
    { new: true }
  ).populate("venue");

  if (!booking) {
    const existing = await VenueBooking.findById(bookingId);
    if (!existing) throw new AppError("Booking not found", 404);
    if (existing.user.toString() !== userId.toString()) {
      throw new AppError("Not authorized to cancel this booking", 403);
    }
    throw new AppError("Booking is already cancelled", 400);
  }

  return booking;
};

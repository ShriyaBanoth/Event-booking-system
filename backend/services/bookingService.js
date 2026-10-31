import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import SeatQuota from "../models/SeatQuota.js";
import AppError from "../utils/AppError.js";

export const MAX_SEATS_PER_USER_PER_EVENT = 10;

const reserveUserSeats = async (userId, eventId, n) => {
  // Step 1: make sure the counter document exists.
  // Two first-time requests can race here, so a duplicate-key error (11000)
  // just means the other request created it first. That's fine.
  try {
    await SeatQuota.updateOne(
      { user: userId, event: eventId },
      { $setOnInsert: { seats: 0 } },
      { upsert: true }
    );
  } catch (err) {
    if (err.code !== 11000) throw err;
  }

  // Step 2: guarded increment. Only succeeds if the user stays within the limit
  // at the moment of the write. No upsert, so null means "over the limit".
  const quota = await SeatQuota.findOneAndUpdate(
    {
      user: userId,
      event: eventId,
      seats: { $lte: MAX_SEATS_PER_USER_PER_EVENT - n },
    },
    { $inc: { seats: n } },
    { new: true }
  );

  if (!quota) {
    throw new AppError(
      `You can book at most ${MAX_SEATS_PER_USER_PER_EVENT} seats for this event.`,
      400
    );
  }
};

const releaseUserSeats = async (userId, eventId, n) => {
  // seats >= n keeps the counter from going negative for bookings made
  // before this feature existed (those have no counter).
  await SeatQuota.updateOne(
    { user: userId, event: eventId, seats: { $gte: n } },
    { $inc: { seats: -n } }
  );
};

export const createBooking = async ({ userId, eventId, seats }) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const seatsRequested = Number(seats);
  if (!Number.isInteger(seatsRequested) || seatsRequested < 1) {
    throw new AppError("Seats must be a whole number of at least 1", 400);
  }

  if (seatsRequested > MAX_SEATS_PER_USER_PER_EVENT) {
    throw new AppError(
      `You can book at most ${MAX_SEATS_PER_USER_PER_EVENT} seats per event`,
      400
    );
  }

  // Reserve the user's quota first (cheapest rejection). Any failure after
  // this point must give it back.
  await reserveUserSeats(userId, eventId, seatsRequested);

  let booking;
  try {
    // Atomic update: succeeds only if the event is still in the future AND
    // enough seats remain at the moment of the write.
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        availableSeats: { $gte: seatsRequested },
        date: { $gt: new Date() },
      },
      { $inc: { availableSeats: -seatsRequested } },
      { new: true }
    );

    if (!event) {
      const existingEvent = await Event.findById(eventId);
      if (!existingEvent) {
        throw new AppError("Event not found", 404);
      }
      if (existingEvent.date <= new Date()) {
        throw new AppError("This event has already taken place", 400);
      }
      throw new AppError(
        `Not enough seats available. Only ${existingEvent.availableSeats} seat(s) left.`,
        400
      );
    }

    try {
      booking = await Booking.create({
        user: userId,
        event: event._id,
        seats: seatsRequested,
        totalPrice: event.price * seatsRequested,
        status: "confirmed",
      });
    } catch (err) {
      // Compensating action: the event seats were already taken, give them back
      await Event.findByIdAndUpdate(event._id, {
        $inc: { availableSeats: seatsRequested },
      });
      throw err;
    }
  } catch (err) {
    // Any failure after the reserve gives the user's quota back
    await releaseUserSeats(userId, eventId, seatsRequested);
    throw err;
  }

  return Booking.findById(booking._id).populate("event", "name date venue price");
};

export const listUserBookings = async (userId) => {
  return Booking.find({ user: userId })
    .populate("event", "name date venue price imageUrl")
    .sort({ createdAt: -1 });
};

export const cancelBooking = async ({ bookingId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new AppError("Invalid booking ID", 400);
  }

  // Atomic state transition: only ONE concurrent request can flip
  // confirmed -> cancelled, so seats are released exactly once.
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, user: userId, status: "confirmed" },
    { status: "cancelled" },
    { new: true }
  );

  if (!booking) {
    const existing = await Booking.findById(bookingId);
    if (!existing) throw new AppError("Booking not found", 404);
    if (existing.user.toString() !== userId.toString()) {
      throw new AppError("Not authorized to cancel this booking", 403);
    }
    throw new AppError("Booking is already cancelled", 400);
  }

  // Release seats only after we've won the status transition
  await Event.findByIdAndUpdate(booking.event, {
    $inc: { availableSeats: booking.seats },
  });

  // Give the user's per-event quota back as well
  await releaseUserSeats(booking.user, booking.event, booking.seats);

  return booking;
};

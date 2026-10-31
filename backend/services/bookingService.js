import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import AppError from "../utils/AppError.js";

export const createBooking = async ({ userId, eventId, seats }) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const seatsRequested = Number(seats);
  if (!Number.isInteger(seatsRequested) || seatsRequested < 1) {
    throw new AppError("Seats must be a whole number of at least 1", 400);
  }

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

  let booking;
  try {
    booking = await Booking.create({
      user: userId,
      event: event._id,
      seats: seatsRequested,
      totalPrice: event.price * seatsRequested,
      status: "confirmed",
    });
  } catch (err) {
    // Compensating action: the seats were already taken, so give them back
    await Event.findByIdAndUpdate(event._id, {
      $inc: { availableSeats: seatsRequested },
    });
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

  return booking;
};

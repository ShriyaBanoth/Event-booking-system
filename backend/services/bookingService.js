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

  // Atomic update: only succeeds if there are still enough available seats
  // at the moment of the write. This prevents overbooking under concurrent
  // requests without needing a multi-document transaction, since it's a
  // single conditional update on one document.
  const event = await Event.findOneAndUpdate(
    { _id: eventId, availableSeats: { $gte: seatsRequested } },
    { $inc: { availableSeats: -seatsRequested } },
    { new: true }
  );

  if (!event) {
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      throw new AppError("Event not found", 404);
    }
    throw new AppError(
      `Not enough seats available. Only ${existingEvent.availableSeats} seat(s) left.`,
      400
    );
  }

  const booking = await Booking.create({
    user: userId,
    event: event._id,
    seats: seatsRequested,
    totalPrice: event.price * seatsRequested,
    status: "confirmed",
  });

  return Booking.findById(booking._id).populate("event", "name date venue price");
};

export const listUserBookings = async (userId) => {
  return Booking.find({ user: userId })
    .populate("event", "name date venue price imageUrl")
    .sort({ createdAt: -1 });
};

export const cancelBooking = async ({ bookingId, userId }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.user.toString() !== userId.toString()) {
    throw new AppError("Not authorized to cancel this booking", 403);
  }

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  booking.status = "cancelled";
  await booking.save();

  // Release the seats back to the event's inventory
  await Event.findByIdAndUpdate(booking.event, {
    $inc: { availableSeats: booking.seats },
  });

  return booking;
};

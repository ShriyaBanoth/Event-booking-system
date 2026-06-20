import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { eventId, seats } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400);
    throw new Error("Invalid event ID");
  }

  const seatsRequested = Number(seats);
  if (!Number.isInteger(seatsRequested) || seatsRequested < 1) {
    res.status(400);
    throw new Error("Seats must be a whole number of at least 1");
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
    // Either the event doesn't exist, or there weren't enough seats left
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.status(400);
    throw new Error(
      `Not enough seats available. Only ${existingEvent.availableSeats} seat(s) left.`
    );
  }

  const booking = await Booking.create({
    user: req.user._id,
    event: event._id,
    seats: seatsRequested,
    totalPrice: event.price * seatsRequested,
    status: "confirmed",
  });

  const populatedBooking = await Booking.findById(booking._id).populate(
    "event",
    "name date venue price"
  );

  res.status(201).json({
    success: true,
    message: "Booking confirmed",
    data: { booking: populatedBooking },
  });
});

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("event", "name date venue price imageUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { bookings } });
});

// @desc    Cancel a booking and release seats back to the event
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (booking.status === "cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  // Release the seats back to the event's inventory
  await Event.findByIdAndUpdate(booking.event, {
    $inc: { availableSeats: booking.seats },
  });

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: { booking },
  });
});

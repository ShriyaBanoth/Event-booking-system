import * as bookingService from "../services/bookingService.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { eventId, seats } = req.body;

  const booking = await bookingService.createBooking({
    userId: req.user._id,
    eventId,
    seats,
  });

  res.status(201).json({
    success: true,
    message: "Booking confirmed",
    data: { booking },
  });
});

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listUserBookings(req.user._id);
  res.status(200).json({ success: true, data: { bookings } });
});

// @desc    Cancel a booking and release seats back to the event
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.cancelBooking({
    bookingId: req.params.id,
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: { booking },
  });
});

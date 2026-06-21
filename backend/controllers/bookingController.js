import * as bookingService from "../services/bookingService.js";
import asyncHandler from "../utils/asyncHandler.js";
import QRCode from "qrcode";

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
// @desc    Generate QR ticket
// @route   GET /api/bookings/:id/qr
// @access  Private
export const getBookingQRCode = asyncHandler(async (req, res) => {
  const bookings = await bookingService.listUserBookings(req.user._id);

  const booking = bookings.find(
    (b) => b._id.toString() === req.params.id
  );

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const qrData = JSON.stringify({
    bookingId: booking._id,
    event: booking.event?.name,
    seats: booking.seats,
    status: booking.status,
  });

  const qrCode = await QRCode.toDataURL(qrData);

  res.status(200).json({
    success: true,
    data: {
      qrCode,
    },
  });
});
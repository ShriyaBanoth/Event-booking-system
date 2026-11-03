import * as venueBookingService from "../services/venueBookingService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createVenueBooking = asyncHandler(async (req, res) => {
  const { venueId, guests, eventType, eventDate, slot } = req.body;

  const booking = await venueBookingService.createVenueBooking({
    userId: req.user._id,
    venueId,
    guests,
    eventType,
    eventDate,
    slot,
  });

  res.status(201).json({ success: true, message: "Venue booking confirmed", data: booking });
});

export const getMyVenueBookings = asyncHandler(async (req, res) => {
  const bookings = await venueBookingService.listMyVenueBookings(req.user._id);
  res.json({ success: true, data: bookings });
});

export const cancelVenueBooking = asyncHandler(async (req, res) => {
  const booking = await venueBookingService.cancelVenueBooking({
    bookingId: req.params.id,
    userId: req.user._id,
  });
  res.json({ success: true, message: "Venue booking cancelled", data: booking });
});

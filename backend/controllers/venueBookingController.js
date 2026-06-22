import VenueBooking from "../models/VenueBooking.js";

export const createVenueBooking = async (req, res) => {
  try {
    const { venueId, guests, eventType } = req.body;

    const booking = await VenueBooking.create({
      user: req.user._id,
      venue: venueId,
      guests,
      eventType,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyVenueBookings = async (req, res) => {
  try {
    const bookings = await VenueBooking.find({
      user: req.user._id,
    }).populate("venue");

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
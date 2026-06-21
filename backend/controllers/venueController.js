import Venue from "../models/Venue.js";

export const getRecommendedVenues = async (req, res) => {
  try {
    const { city, guests, type } = req.query;

    const query = {};

    if (city) {
      query.city = city;
    }

    if (guests) {
      query.capacity = { $gte: Number(guests) };
    }

    if (type) {
      query.eventTypes = type;
    }

    const venues = await Venue.find(query).sort({
      rating: -1,
    });

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
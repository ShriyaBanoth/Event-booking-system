import Event from "../models/Event.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all events (supports search, category filter, sort, pagination)
// @route   GET /api/events
// @access  Public
// Query params:
//   search    - text search across name/description/venue
//   category  - exact category filter
//   sort      - "date_asc" | "date_desc" | "name_asc" | "name_desc" | "price_asc" | "price_desc"
//   page      - page number (default 1)
//   limit     - results per page (default 9)
export const getAllEvents = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { venue: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  const sortMap = {
    date_asc: { date: 1 },
    date_desc: { date: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };
  const sortOption = sortMap[sort] || { date: 1 };

  const [events, total] = await Promise.all([
    Event.find(filter).sort(sortOption).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.status(200).json({ success: true, data: { event } });
});

// @desc    Get distinct categories (used to populate filter dropdown)
// @route   GET /api/events/categories
// @access  Public
export const getEventCategories = asyncHandler(async (req, res) => {
  const categories = await Event.distinct("category");
  res.status(200).json({ success: true, data: { categories } });
});

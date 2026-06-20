import * as eventService from "../services/eventService.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all events (supports search, category filter, sort, pagination)
// @route   GET /api/events
// @access  Public
export const getAllEvents = asyncHandler(async (req, res) => {
  const { search, category, sort, page, limit } = req.query;
  const result = await eventService.listEvents({ search, category, sort, page, limit });

  res.status(200).json({ success: true, data: result });
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);

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
  const categories = await eventService.listCategories();
  res.status(200).json({ success: true, data: { categories } });
});

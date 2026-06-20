import Event from "../models/Event.js";
import { getCached, setCached } from "../utils/cache.js";

const CATEGORIES_CACHE_KEY = "event:categories";

const SORT_OPTIONS = {
  date_asc: { date: 1 },
  date_desc: { date: -1 },
  name_asc: { name: 1 },
  name_desc: { name: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 50;

export const listEvents = async ({ search, category, sort, page, limit }) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (safePage - 1) * safeLimit;

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

  const sortOption = SORT_OPTIONS[sort] || SORT_OPTIONS.date_asc;

  const [events, total] = await Promise.all([
    Event.find(filter).sort(sortOption).skip(skip).limit(safeLimit),
    Event.countDocuments(filter),
  ]);

  return {
    events,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

export const getEventById = async (id) => {
  return Event.findById(id);
};

export const listCategories = async () => {
  const cached = getCached(CATEGORIES_CACHE_KEY);
  if (cached) return cached;

  const categories = await Event.distinct("category");
  setCached(CATEGORIES_CACHE_KEY, categories, 60_000); // categories rarely change; 60s TTL is plenty
  return categories;
};

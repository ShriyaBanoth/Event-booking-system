// Mirrors backend/models/Event.js EVENT_CATEGORIES and the sort keys
// accepted by GET /api/events. Kept here so every component that needs
// these lists (filters, forms, validation messages) imports one source
// instead of re-typing the same strings in three places.
export const EVENT_CATEGORIES = [
  "Music",
  "Technology",
  "Sports",
  "Arts & Theatre",
  "Business",
  "Food & Drink",
  "Comedy",
  "Other",
];

export const SORT_OPTIONS = [
  { value: "date_asc", label: "Date: Soonest first" },
  { value: "date_desc", label: "Date: Latest first" },
  { value: "name_asc", label: "Name: A-Z" },
  { value: "name_desc", label: "Name: Z-A" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
];

export const MAX_BOOKABLE_SEATS = 10;

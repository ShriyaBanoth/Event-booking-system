import { body, query, validationResult } from "express-validator";
import { EVENT_CATEGORIES } from "../models/Event.js";

// Collects express-validator errors and returns a single 400 response
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    throw new Error(message);
  }
  next();
};

export const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const createBookingValidationRules = [
  body("eventId")
    .trim()
    .notEmpty()
    .withMessage("eventId is required")
    .isMongoId()
    .withMessage("eventId must be a valid ID"),
  body("seats")
    .notEmpty()
    .withMessage("seats is required")
    .isInt({ min: 1, max: 10 })
    .withMessage("seats must be a whole number between 1 and 10"),
];

const SORT_VALUES = ["date_asc", "date_desc", "name_asc", "name_desc", "price_asc", "price_desc"];

export const listEventsValidationRules = [
  query("search")
  .optional({ values: "falsy" })
  .trim()
  .isLength({ max: 100 })
  .withMessage("search term is too long"),
  query("category")
  .optional({ values: "falsy" })
  .trim()
  .isIn(EVENT_CATEGORIES)
  .withMessage(`category must be one of: ${EVENT_CATEGORIES.join(", ")}`),
  query("sort").optional({ values: "falsy" })
    .isIn(SORT_VALUES)
    .withMessage(`sort must be one of: ${SORT_VALUES.join(", ")}`),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be between 1 and 50"),
];

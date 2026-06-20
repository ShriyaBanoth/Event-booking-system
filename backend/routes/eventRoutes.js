import express from "express";
import { getAllEvents, getEventById, getEventCategories } from "../controllers/eventController.js";
import { listEventsValidationRules, handleValidationErrors } from "../middleware/validators.js";

const router = express.Router();

// IMPORTANT: /categories must be declared before /:id so it isn't swallowed as an ObjectId param
router.get("/categories", getEventCategories);
router.get("/", listEventsValidationRules, handleValidationErrors, getAllEvents);
router.get("/:id", getEventById);

export default router;

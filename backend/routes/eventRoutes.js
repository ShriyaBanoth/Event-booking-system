import express from "express";
import { getAllEvents, getEventById, getEventCategories } from "../controllers/eventController.js";

const router = express.Router();

// IMPORTANT: /categories must be declared before /:id so it isn't swallowed as an ObjectId param
router.get("/categories", getEventCategories);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

export default router;

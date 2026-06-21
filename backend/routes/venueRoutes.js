import express from "express";
import { getRecommendedVenues } from "../controllers/venueController.js";

const router = express.Router();

router.get("/recommendations", getRecommendedVenues);

export default router;
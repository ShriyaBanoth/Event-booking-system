import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { requestId } from "./middleware/requestId.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import venueBookingRoutes from "./routes/venueBookingRoutes.js";

const app = express();
const isTest = process.env.NODE_ENV === "test";

// Correlation ID - attached first so every later log line can reference it
app.use(requestId);

// Security headers
app.use(helmet());

// Request logging (skipped in tests to keep output clean)
morgan.token("id", (req) => req.id);
if (!isTest) {
  const format =
    process.env.NODE_ENV === "production"
      ? ":id :method :url :status :res[content-length] - :response-time ms"
      : ":id :method :url :status :response-time ms";
  app.use(morgan(format));
}

// Gzip compression for responses
app.use(compression());

// Core middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (skipped in tests so test suites can make many requests)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { success: false, message: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { success: false, message: "Too many auth attempts, please try again later" },
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Health check - also reports DB connection state
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.status(200).json({
    success: true,
    message: "API is running",
    db: dbState === 1 ? "connected" : "disconnected",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/venue-bookings", venueBookingRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;

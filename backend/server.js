import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import validateEnv from "./config/validateEnv.js";
import { requestId } from "./middleware/requestId.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";

dotenv.config();
validateEnv();
connectDB();

const app = express();

// Correlation ID - attached first so every later log line can reference it
app.use(requestId);

// Security headers
app.use(helmet());

// Request logging (skip in test environments to keep output clean).
// Custom format includes the request ID so a single log line can be
// traced end-to-end, and is matched up with the X-Request-Id response header.
morgan.token("id", (req) => req.id);
if (process.env.NODE_ENV !== "test") {
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

// Basic rate limiting to slow down abuse (e.g. brute-force login attempts)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // generous default; tighten per-route below for auth
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter limit on register/login to deter brute-forcing
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts, please try again later" },
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Health check route - also reports DB connection state, useful for
// container orchestration liveness/readiness probes
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

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown: stop accepting new connections, let in-flight requests
// finish, then close the DB connection cleanly. Matters for zero-downtime
// deploys on platforms like Render that send SIGTERM before killing the process.
const shutdown = (signal) => {
  console.log(`${signal} received: shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed");
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  });

  // Force-exit if shutdown takes too long (stuck connections, etc.)
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;

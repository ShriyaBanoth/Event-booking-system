import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import validateEnv from "./config/validateEnv.js";
import app from "./app.js";

validateEnv();
connectDB();

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

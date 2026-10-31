process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Event from "../models/Event.js";

let mongo;

export const startDb = async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
};

export const stopDb = async () => {
  await mongoose.disconnect();
  await mongo.stop();
};

export const clearDb = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
};

let counter = 0;
export const registerUser = async () => {
  counter += 1;
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: `user${counter}-${Date.now()}@test.com`,
      password: "Test@1234",
    });
  return { token: res.body.data.token, status: res.status };
};

export const makeEvent = (overrides = {}) =>
  Event.create({
    name: "Test Event",
    description: "A test event",
    venue: "Test Venue",
    category: "Music",
    price: 100,
    totalSeats: 100,
    availableSeats: 100,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ...overrides,
  });

export const book = (token, eventId, seats) =>
  request(app)
    .post("/api/bookings")
    .set("Authorization", `Bearer ${token}`)
    .send({ eventId: String(eventId), seats });

export const cancel = (token, bookingId) =>
  request(app)
    .delete(`/api/bookings/${bookingId}`)
    .set("Authorization", `Bearer ${token}`);

export const seatsLeft = async (eventId) =>
  (await Event.findById(eventId)).availableSeats;

export { app, request };

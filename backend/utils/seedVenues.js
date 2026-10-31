import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Venue from "../models/Venue.js";

dotenv.config();

// Fictional sample venues covering every city and event type in the UI.
const sampleVenues = [
  { name: "Lakeview Convention Hall", city: "Hyderabad", capacity: 1200, pricePerDay: 250000, rating: 4.8, eventTypes: ["Wedding", "Corporate"] },
  { name: "Charminar Heritage Banquet", city: "Hyderabad", capacity: 600, pricePerDay: 140000, rating: 4.6, eventTypes: ["Wedding", "Birthday"] },
  { name: "Hitech Business Centre", city: "Hyderabad", capacity: 300, pricePerDay: 90000, rating: 4.4, eventTypes: ["Corporate"] },
  { name: "Marine Palace Ballroom", city: "Mumbai", capacity: 900, pricePerDay: 320000, rating: 4.9, eventTypes: ["Wedding", "Corporate", "Birthday"] },
  { name: "Bandra Rooftop Lounge", city: "Mumbai", capacity: 120, pricePerDay: 75000, rating: 4.5, eventTypes: ["Birthday", "Corporate"] },
  { name: "Juhu Garden Lawns", city: "Mumbai", capacity: 700, pricePerDay: 210000, rating: 4.3, eventTypes: ["Wedding", "Birthday"] },
  { name: "Cubbon Greens Pavilion", city: "Bangalore", capacity: 800, pricePerDay: 180000, rating: 4.7, eventTypes: ["Wedding", "Birthday"] },
  { name: "Tech Park Conference Hall", city: "Bangalore", capacity: 550, pricePerDay: 160000, rating: 4.6, eventTypes: ["Corporate"] },
  { name: "Indiranagar Studio Loft", city: "Bangalore", capacity: 60, pricePerDay: 40000, rating: 4.2, eventTypes: ["Birthday", "Corporate"] },
  { name: "Red Fort Royal Gardens", city: "Delhi", capacity: 1500, pricePerDay: 350000, rating: 4.9, eventTypes: ["Wedding"] },
  { name: "Connaught Boardroom Suites", city: "Delhi", capacity: 150, pricePerDay: 85000, rating: 4.4, eventTypes: ["Corporate"] },
  { name: "Saket Party Terrace", city: "Delhi", capacity: 200, pricePerDay: 70000, rating: 4.1, eventTypes: ["Birthday"] },
  { name: "Marina Seaside Hall", city: "Chennai", capacity: 650, pricePerDay: 150000, rating: 4.5, eventTypes: ["Wedding", "Birthday"] },
  { name: "OMR Corporate Atrium", city: "Chennai", capacity: 400, pricePerDay: 110000, rating: 4.3, eventTypes: ["Corporate"] },
];

const seedVenues = async () => {
  try {
    await connectDB();
    await Venue.deleteMany({});
    console.log("Existing venues cleared");
    const created = await Venue.insertMany(sampleVenues);
    console.log(`${created.length} venues seeded successfully`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Venue seeding failed:", error.message);
    process.exit(1);
  }
};

seedVenues();

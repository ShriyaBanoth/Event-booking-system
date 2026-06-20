import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Event from "../models/Event.js";

dotenv.config();

const sampleEvents = [
  {
    name: "Indie Music Night",
    description:
      "An evening of live performances from up-and-coming indie artists, featuring acoustic sets and full-band performances across three stages.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    venue: "The Loft, Bandra, Mumbai",
    category: "Music",
    totalSeats: 200,
    price: 599,
  },
  {
    name: "DevConf 2026: Future of Web",
    description:
      "A full-day technology conference covering AI-assisted development, modern frontend architecture, and scalable backend systems, with talks from industry practitioners.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    venue: "Hyderabad International Convention Centre",
    category: "Technology",
    totalSeats: 500,
    price: 1499,
  },
  {
    name: "City Marathon 10K",
    description:
      "An annual community 10K run through the city's historic district, open to runners of all levels with timed and untimed categories.",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    venue: "Marine Drive, Mumbai",
    category: "Sports",
    totalSeats: 1000,
    price: 299,
  },
  {
    name: "Shakespeare in the Park: Hamlet",
    description:
      "A contemporary staging of Hamlet performed outdoors under the evening sky, presented by the City Repertory Theatre.",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    venue: "Cubbon Park Amphitheatre, Bengaluru",
    category: "Arts & Theatre",
    totalSeats: 150,
    price: 799,
  },
  {
    name: "Startup Founders Summit",
    description:
      "A half-day summit bringing together early-stage founders, investors, and operators for panel discussions and structured networking.",
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    venue: "WeWork BKC, Mumbai",
    category: "Business",
    totalSeats: 120,
    price: 999,
  },
  {
    name: "Street Food Carnival",
    description:
      "A weekend-long celebration of regional street food, with over 40 vendor stalls, live cooking demos, and a dedicated dessert zone.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    venue: "Jawaharlal Nehru Stadium Grounds, Delhi",
    category: "Food & Drink",
    totalSeats: 800,
    price: 199,
  },
  {
    name: "Stand-Up Night: Open Mic & Headliners",
    description:
      "A mixed-format comedy night featuring five open-mic performers followed by two headlining acts.",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    venue: "Canvas Laugh Club, Mumbai",
    category: "Comedy",
    totalSeats: 100,
    price: 449,
  },
  {
    name: "Classical Sitar & Tabla Recital",
    description:
      "An intimate evening recital of Hindustani classical music featuring sitar and tabla, followed by a short audience Q&A with the performers.",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    venue: "NCPA, Mumbai",
    category: "Music",
    totalSeats: 180,
    price: 699,
  },
];

const seedEvents = async () => {
  try {
    await connectDB();

    await Event.deleteMany({});
    console.log("Existing events cleared");

    const created = await Event.insertMany(
      sampleEvents.map((e) => ({ ...e, availableSeats: e.totalSeats }))
    );
    console.log(`${created.length} events seeded successfully`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedEvents();

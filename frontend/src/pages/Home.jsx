import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Hero */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Event 🎉
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Discover venues, manage bookings, generate QR tickets,
            and organize memorable weddings, birthdays, and corporate events.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/venues"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Find Venue
            </Link>

            <Link
              to="/events"
              className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium"
            >
              Browse Events
            </Link>
          </div>
        </div>

        {/* Event Types */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-5xl mb-4">💍</div>
            <h2 className="text-xl font-semibold mb-2">
              Weddings
            </h2>
            <p className="text-gray-600 mb-4">
              Find premium wedding venues and plan unforgettable celebrations.
            </p>
            <Link
              to="/venues"
              className="text-indigo-600 font-medium"
            >
              Explore Venues →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-5xl mb-4">🎂</div>
            <h2 className="text-xl font-semibold mb-2">
              Birthdays
            </h2>
            <p className="text-gray-600 mb-4">
              Discover party halls, lounges, and celebration spaces.
            </p>
            <Link
              to="/venues"
              className="text-indigo-600 font-medium"
            >
              Explore Venues →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-5xl mb-4">🏢</div>
            <h2 className="text-xl font-semibold mb-2">
              Corporate Events
            </h2>
            <p className="text-gray-600 mb-4">
              Book convention centers and professional event venues.
            </p>
            <Link
              to="/venues"
              className="text-indigo-600 font-medium"
            >
              Explore Venues →
            </Link>
          </div>

        </div>

        {/* Features */}
        <div className="mt-20 bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Platform Features
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🎟️</div>
              <p>Event Booking</p>
            </div>

            <div>
              <div className="text-3xl mb-2">📱</div>
              <p>QR Tickets</p>
            </div>

            <div>
              <div className="text-3xl mb-2">⭐</div>
              <p>Reviews & Ratings</p>
            </div>

            <div>
              <div className="text-3xl mb-2">🏛️</div>
              <p>Venue Recommendations</p>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
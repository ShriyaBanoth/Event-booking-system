import dashboardBg from "../assets/images/Dashboard.png";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${dashboardBg})`,
      }}
    >
      <div className="min-h-screen bg-black/40 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome, {user?.name}
          </h1>

          <p className="text-gray-200 mb-6 text-sm">
            {user?.email}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              to="/events"
              className="bg-white/90 backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-all shadow-lg"
            >
              <h2 className="font-semibold text-gray-900 mb-1">
                Browse Events
              </h2>

              <p className="text-sm text-gray-600">
                Discover upcoming events and book your seats.
              </p>
            </Link>

            <Link
              to="/bookings"
              className="bg-white/90 backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-all shadow-lg"
            >
              <h2 className="font-semibold text-gray-900 mb-1">
                My Bookings
              </h2>

              <p className="text-sm text-gray-600">
                View, track, and cancel your event bookings.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
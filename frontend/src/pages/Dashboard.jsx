import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome, {user?.name}</h1>
        <p className="text-gray-500 mb-6 text-sm">{user?.email}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/events"
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-gray-900 mb-1">Browse Events</h2>
            <p className="text-sm text-gray-500">Discover upcoming events and book your seats.</p>
          </Link>

          <Link
            to="/bookings"
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-gray-900 mb-1">My Bookings</h2>
            <p className="text-sm text-gray-500">View, track, and cancel your event bookings.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

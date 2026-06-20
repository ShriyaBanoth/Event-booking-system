import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Event Booking System
        </h1>
        <p className="text-gray-500 mb-8">
          Browse events and book your seats in just a few clicks.
        </p>
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-2.5 text-sm"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg px-5 py-2.5 text-sm"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-2.5 text-sm"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

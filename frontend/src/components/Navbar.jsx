import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    setMenuOpen(false);
    navigate("/login");
  };

  const linkClass = "block sm:inline text-gray-600 hover:text-gray-900 py-2 sm:py-0";

  return (
    <nav className="border-b border-gray-200 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-gray-900" onClick={() => setMenuOpen(false)}>
          EventBooking
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <Link to="/" className={linkClass}>
  Home
</Link>
  <Link to="/events" className={linkClass}>
    Events
  </Link>

  <Link to="/venues" className={linkClass}>
    Venues
  </Link>
  <Link to="/about" className={linkClass}>
  About Us
</Link>
          {isAuthenticated ? (
            <>
              <Link to="/bookings" className={linkClass}>
                My Bookings
              </Link>
              <Link to="/dashboard" className={linkClass}>
                Dashboard
              </Link>
              <span className="text-gray-400">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger toggle */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="sm:hidden p-2 -mr-2 text-gray-600"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 text-sm shadow-sm z-40">
          <Link to="/" className={linkClass} onClick={() => setMenuOpen(false)}>
  Home
</Link>
          <Link to="/events" className={linkClass} onClick={() => setMenuOpen(false)}>
            Events
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/bookings" className={linkClass} onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
              <Link to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <div className="text-gray-400 py-2">{user?.name}</div>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-block mt-1 mb-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

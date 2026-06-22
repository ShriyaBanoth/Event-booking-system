import { useNavigate } from "react-router-dom";
import homeBanner from "../assets/images/HomeBanner.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${homeBanner})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-[calc(100vh-56px)] px-12 max-w-3xl text-white">
        <h1 className="text-6xl font-bold mb-4">
          EVENT BOOKING
          <span className="block text-green-500">
            MADE EASY
          </span>
        </h1>

        <p className="text-xl text-gray-200 mb-8">
          Discover. Book. Celebrate.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/events")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Explore Events
          </button>

          <button
            onClick={() => navigate("/venues")}
            className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black"
          >
            Find Venues
          </button>
        </div>
      </div>
    </div>
  );
}
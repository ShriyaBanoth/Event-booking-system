import venueBg from "../assets/images/Venue.png";
import { useState } from "react";
import toast from "react-hot-toast";
import { getVenueRecommendationsRequest } from "../api/venues";
import VenueBookingModal from "../components/VenueBookingModal";

export default function VenueRecommendations() {
  const [city, setCity] = useState("Hyderabad");
  const [type, setType] = useState("Wedding");
  const [guests, setGuests] = useState(500);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const searchVenues = async () => {
    setLoading(true);
    try {
      const res = await getVenueRecommendationsRequest({ city, guests, type });
      setVenues(res.data.data);
      setSearched(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't load venues");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${venueBg})`,
      }}
    >
      <div className="min-h-screen bg-black/60">
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            Venue Recommendations
          </h1>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <select
              className="border p-2 rounded bg-white text-black"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option>Hyderabad</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>Delhi</option>
              <option>Chennai</option>
            </select>

            <select
              className="border p-2 rounded bg-white text-black"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Corporate</option>
            </select>

            <input
              type="number"
              min={1}
              className="border p-2 rounded bg-white text-black"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              aria-label="Minimum capacity needed"
            />
          </div>

          <button
            onClick={searchVenues}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Searching..." : "Find Venues"}
          </button>

          {searched && !loading && venues.length === 0 && (
            <p className="mt-8 text-white">
              No venues match that city, event type and capacity. Try fewer guests or another city.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white/90 backdrop-blur-sm border rounded-xl p-5 shadow"
              >
                {venue.imageUrl && (
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}

                <h2 className="text-xl font-semibold">{venue.name}</h2>

                <p>📍 {venue.city}</p>
                <p>👥 Capacity: {venue.capacity}</p>
                <p>⭐ {venue.rating}</p>
                <p>₹ {venue.pricePerDay.toLocaleString()}</p>

                <button
                  onClick={() => setSelectedVenue(venue)}
                  className="bg-green-600 text-white px-4 py-2 rounded mt-3"
                >
                  Book Venue
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedVenue && (
        <VenueBookingModal
          venue={selectedVenue}
          eventType={type}
          initialGuests={guests}
          onClose={() => setSelectedVenue(null)}
        />
      )}
    </div>
  );
}

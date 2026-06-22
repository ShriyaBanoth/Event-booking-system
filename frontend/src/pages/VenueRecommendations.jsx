import venueBg from "../assets/images/Venue.png";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { createVenueBookingRequest } from "../api/venueBookings";

export default function VenueRecommendations() {
  const [city, setCity] = useState("Hyderabad");
  const [type, setType] = useState("Wedding");
  const [guests, setGuests] = useState(500);
  const [venues, setVenues] = useState([]);

  const searchVenues = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/venues/recommendations",
        {
          params: {
            city,
            guests,
            type,
          },
        }
      );

      setVenues(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookVenue = async (venue) => {
    try {
      await createVenueBookingRequest({
        venueId: venue._id,
        guests,
        eventType: type,
      });

      toast.success("Venue booked successfully");
    } catch (error) {
      toast.error("Failed to book venue");
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
  className="border p-2 rounded bg-white text-black"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <button
            onClick={searchVenues}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Find Venues
          </button>

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

                <h2 className="text-xl font-semibold">
                  {venue.name}
                </h2>

                <p>📍 {venue.city}</p>
                <p>👥 Capacity: {venue.capacity}</p>
                <p>⭐ {venue.rating}</p>
                <p>₹ {venue.pricePerDay.toLocaleString()}</p>

                <button
                  onClick={() => handleBookVenue(venue)}
                  className="bg-green-600 text-white px-4 py-2 rounded mt-3"
                >
                  Book Venue
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
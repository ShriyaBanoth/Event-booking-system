import { Link } from "react-router-dom";
import musicImg from "../assets/images/music.jpg";
import indieImg from "../assets/images/indie.jpeg";
import marathonImg from "../assets/images/Marathon.jpeg";
import streetImg from "../assets/images/street.jpeg";
import startupImg from "../assets/images/Startup.jpeg";
import shakespeareImg from "../assets/images/Shakespeare.jpeg";
import sitarImg from "../assets/images/sitar&tabla.jpeg";
import devconfImg from "../assets/images/DevConf.jpeg";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const eventImages = {
  "Indie Music Night": indieImg,
  "Classical Sitar & Tabla Recital": sitarImg,
  "City Marathon 10K": marathonImg,
  "Street Food Carnival": streetImg,
  "Startup Founders Summit": startupImg,
  "DevConf 2026: Future of Web": devconfImg,
  "Shakespeare in the Park: Hamlet": shakespeareImg,
};

export default function EventCard({ event }) {
  const isSoldOut = event.availableSeats <= 0;
  const isLowAvailability = !isSoldOut && event.availableSeats <= event.totalSeats * 0.1;

  return (
    <Link
      to={`/events/${event._id}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
  <img
    src={eventImages[event.name] || musicImg}
    alt={event.name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />

  <div className="absolute top-3 left-3">
    <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
      {event.category}
    </span>
  </div>
</div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {event.name}
        </h3>
        {event.reviewCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="text-amber-500">★ {Number(event.averageRating).toFixed(1)}</span>
            <span className="text-gray-400">· {event.reviewCount}</span>
          </div>
        )}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <div>{formatDate(event.date)}</div>
            <div className="text-gray-400 line-clamp-1">{event.venue}</div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <div className="font-semibold text-gray-900">
              {event.price > 0 ? `₹${event.price}` : "Free"}
            </div>
            {isSoldOut ? (
              <span className="text-xs text-red-600 font-medium">Sold out</span>
            ) : isLowAvailability ? (
              <span className="text-xs text-amber-600 font-medium">
                {event.availableSeats} left
              </span>
            ) : (
              <span className="text-xs text-green-600 font-medium">Available</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

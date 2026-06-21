import { Link } from "react-router-dom";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function EventCard({ event }) {
  const isSoldOut = event.availableSeats <= 0;
  const isLowAvailability = !isSoldOut && event.availableSeats <= event.totalSeats * 0.1;

  return (
    <Link
      to={`/events/${event._id}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="h-36 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
        <span className="text-white/90 text-sm font-medium px-3 py-1 bg-black/15 rounded-full">
          {event.category}
        </span>
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

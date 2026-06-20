import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserBookingsRequest, cancelBookingRequest } from "../api/bookings";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null); // booking object awaiting confirmation

  const loadBookings = () => {
    setLoading(true);
    getUserBookingsRequest()
      .then((res) => setBookings(res.data.data.bookings))
      .catch(() => toast.error("Couldn't load your bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    loadBookings();
  }, []);

  const handleConfirmCancel = async () => {
    const bookingId = pendingCancel._id;
    setCancellingId(bookingId);
    try {
      await cancelBookingRequest(bookingId);
      toast.success("Booking cancelled");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
      setPendingCancel(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Bookings</h1>
        <p className="text-gray-500 mb-6 text-sm">View and manage your event bookings</p>

        {loading ? (
          <LoadingSpinner label="Loading your bookings..." />
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            message="Once you book a seat for an event, it'll show up here."
            action={
              <Link
                to="/events"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 text-sm"
              >
                Browse events
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const event = booking.event;
              const isCancelled = booking.status === "cancelled";
              return (
                <div
                  key={booking._id}
                  className={`bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCancelled ? "border-gray-200 opacity-60" : "border-gray-200"
                  }`}
                >
                  <div>
                    <Link
                      to={event ? `/events/${event._id}` : "#"}
                      className="font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {event?.name || "Event removed"}
                    </Link>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {event && formatDate(event.date)} · {booking.seats} seat
                      {booking.seats > 1 ? "s" : ""} ·{" "}
                      {booking.totalPrice > 0 ? `₹${booking.totalPrice}` : "Free"}
                    </div>
                    <span
                      className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                        isCancelled ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-700"
                      }`}
                    >
                      {isCancelled ? "Cancelled" : "Confirmed"}
                    </span>
                  </div>

                  {!isCancelled && (
                    <Button
                      variant="danger"
                      onClick={() => setPendingCancel(booking)}
                      className="shrink-0 self-start sm:self-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pendingCancel && (
        <ConfirmDialog
          title="Cancel this booking?"
          message={`This will cancel your booking for "${pendingCancel.event?.name}" (${pendingCancel.seats} seat${pendingCancel.seats > 1 ? "s" : ""}) and release the seats back to other attendees. This can't be undone.`}
          confirmLabel="Cancel booking"
          variant="danger"
          submitting={cancellingId === pendingCancel._id}
          onConfirm={handleConfirmCancel}
          onClose={() => setPendingCancel(null)}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getUserBookingsRequest,
  cancelBookingRequest,
  getBookingQRRequest,
} from "../api/bookings";
import { getVenueBookingsRequest } from "../api/venueBookings";
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
  const [venueBookings, setVenueBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null); // booking object awaiting confirmation
  const [qrCode, setQrCode] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const loadBookings = async () => {
  setLoading(true);

  try {
    const [eventRes, venueRes] = await Promise.all([
      getUserBookingsRequest(),
      getVenueBookingsRequest(),
    ]);

    setBookings(eventRes.data.data.bookings);
    setVenueBookings(venueRes.data.data);
  } catch (error) {
    toast.error("Couldn't load your bookings");
  } finally {
    setLoading(false);
  }
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
      prev.map((b) =>
        b._id === bookingId
          ? { ...b, status: "cancelled" }
          : b
      )
    );

    setPendingCancel(null);
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Failed to cancel booking"
    );
  } finally {
    setCancellingId(null);
  }
};
  const handleViewQR = async (bookingId) => {
  try {
    const res = await getBookingQRRequest(bookingId);

    setQrCode(res.data.data.qrCode);
    setShowQR(true);
  } catch (err) {
    toast.error("Failed to load QR ticket");
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
  <div className="flex gap-2">
    <Button
      onClick={() => handleViewQR(booking._id)}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      QR Ticket
    </Button>

    <Button
      variant="danger"
      onClick={() => setPendingCancel(booking)}
      className="shrink-0 self-start sm:self-auto"
    >
      Cancel
    </Button>
  </div>
)}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {venueBookings.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8">
          <h2 className="text-xl font-semibold mb-4">
            My Venue Bookings
          </h2>

          <div className="space-y-3">
            {venueBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border rounded-xl p-4"
              >
                <h3 className="font-medium">
                  {booking.venue?.name}
                </h3>

                <p>📍 {booking.venue?.city}</p>
                <p>👥 Guests: {booking.guests}</p>
                <p>🎉 {booking.eventType}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {showQR && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
      <h2 className="text-lg font-semibold mb-4">
        Your Ticket QR Code
      </h2>

      <img
        src={qrCode}
        alt="QR Ticket"
        className="mx-auto w-64 h-64"
      />

      <Button
        className="mt-4"
        onClick={() => setShowQR(false)}
      >
        Close
      </Button>
    </div>
  </div>
)}

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

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getEventByIdRequest } from "../api/events";
import { createBookingRequest } from "../api/bookings";
import { getReviewsByEventRequest, createReviewRequest } from "../api/reviews";
import { getUserBookingsRequest } from "../api/bookings";
import { useAuth } from "../hooks/useAuth";
import BookingModal from "../components/BookingModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { MAX_BOOKABLE_SEATS } from "../utils/constants";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function EventDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [seats, setSeats] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [myReview, setMyReview] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    setLoading(true);
    getEventByIdRequest(id)
      .then((res) => setEvent(res.data.data.event))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setReviewLoading(true);
    getReviewsByEventRequest(id)
      .then((res) => setReviews(res.data.data.reviews))
      .catch(() => setReviews([]))
      .finally(() => setReviewLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) return setCanReview(false);

    // Check whether the current user has a confirmed booking for this event
    getUserBookingsRequest()
      .then((res) => {
        const bookings = res.data.data.bookings || [];
        const has = bookings.some((b) => b.event && b.event._id === id && b.status === "confirmed");
        // Also ensure user hasn't already left a review locally (server will enforce)
        const already = reviews.some((r) => r.user && r.user._id === (res.data.data.user?._id));
        setCanReview(has && !already);
      })
      .catch(() => setCanReview(false));
  }, [isAuthenticated, id, reviews]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book seats");
      navigate("/login", { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      await createBookingRequest({ eventId: id, seats });
      toast.success("Booking confirmed!");
      setShowModal(false);
      navigate("/bookings");
    } catch (err) {
      const message = err.response?.data?.message || "Booking failed. Please try again.";
      toast.error(message);
      // Refresh event data in case seat availability changed
      getEventByIdRequest(id).then((res) => setEvent(res.data.data.event));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading event..." />;

  if (notFound || !event) {
    return (
      <EmptyState
        title="Event not found"
        message="This event may have been removed or the link is incorrect."
        action={
          <Link to="/events" className="text-indigo-600 hover:underline text-sm font-medium">
            Back to all events
          </Link>
        }
      />
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const maxSeats = Math.min(event.availableSeats, MAX_BOOKABLE_SEATS);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/events" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to events
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-4">
          <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white/90 text-sm font-medium px-3 py-1 bg-black/15 rounded-full">
              {event.category}
            </span>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{event.name}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span>📅 {formatDate(event.date)}</span>
              <span>📍 {event.venue}</span>
            </div>

            <p className="text-gray-600 mb-6 whitespace-pre-line">{event.description}</p>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {event.price > 0 ? `₹${event.price}` : "Free"}
                </div>
                <div
                  className={`text-sm font-medium ${isSoldOut ? "text-red-600" : "text-gray-500"}`}
                >
                  {isSoldOut
                    ? "Sold out"
                    : `${event.availableSeats} of ${event.totalSeats} seats available`}
                </div>
              </div>

              {!isSoldOut && (
                <div className="flex items-center gap-3">
  <select
    value={seats}
    onChange={(e) => setSeats(Number(e.target.value))}
    className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
  >
    {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
      <option key={n} value={n}>
        {n} seat{n > 1 ? "s" : ""}
      </option>
    ))}
  </select>

  <Button onClick={handleBookClick}>Book Now</Button>

  <Link
    to="/venues"
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
  >
    🏛️ Find Venue
  </Link>
</div>
              )}
            </div>
          </div>
        </div>

          <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Reviews</h2>

              {reviewLoading ? (
                <div className="text-sm text-gray-500">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-sm text-gray-500">No reviews yet.</div>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r._id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{r.user?.name || "Anonymous"}</div>
                        <div className="text-amber-500 font-semibold">{r.rating} ★</div>
                      </div>
                      {r.comment && <div className="text-sm text-gray-600 mt-2">{r.comment}</div>}
                    </li>
                  ))}
                </ul>
              )}

              {isAuthenticated && canReview && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Leave a review</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <select
                      value={myReview.rating}
                      onChange={(e) => setMyReview((s) => ({ ...s, rating: Number(e.target.value) }))}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} star{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={myReview.comment}
                    onChange={(e) => setMyReview((s) => ({ ...s, comment: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                    rows={4}
                    placeholder="Share your experience (optional)"
                  />
                  <div className="mt-3 flex gap-3">
                    <Button
                      onClick={async () => {
                        setReviewSubmitting(true);
                        try {
                          await createReviewRequest({ eventId: id, rating: myReview.rating, comment: myReview.comment });
                          toast.success("Review submitted");
                          // Refresh reviews and event to show updated averages
                          const [revRes, evRes] = await Promise.all([
                            getReviewsByEventRequest(id),
                            getEventByIdRequest(id),
                          ]);
                          setReviews(revRes.data.data.reviews);
                          setEvent(evRes.data.data.event);
                          setCanReview(false);
                        } catch (err) {
                          const message = err.response?.data?.message || "Failed to submit review";
                          toast.error(message);
                        } finally {
                          setReviewSubmitting(false);
                        }
                      }}
                      disabled={reviewSubmitting}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>

      {showModal && (
        <BookingModal
          event={event}
          seats={seats}
          submitting={submitting}
          onConfirm={handleConfirmBooking}
          onClose={() => !submitting && setShowModal(false)}
        />
      )}
    </div>
  );
}

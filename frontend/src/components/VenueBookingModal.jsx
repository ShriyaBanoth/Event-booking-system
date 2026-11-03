import { useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import { createVenueBookingRequest } from "../api/venueBookings";

const SLOTS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

const todayLocal = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export default function VenueBookingModal({
  venue,
  eventType,
  initialGuests,
  onClose,
  onBooked,
}) {
  const [guestsText, setGuestsText] = useState(String(initialGuests || ""));
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("evening");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const guests = guestsText === "" ? 0 : parseInt(guestsText, 10);
  const tooMany = guests > venue.capacity;
  const guestsInvalid = guests < 1;
  const dateInvalid = !date || date < todayLocal();
  const canSubmit = !tooMany && !guestsInvalid && !dateInvalid && !submitting;

  const handleSubmit = async () => {
    setServerError("");
    setSubmitting(true);
    try {
      await createVenueBookingRequest({
        venueId: venue._id,
        guests,
        eventType,
        eventDate: date,
        slot,
      });
      toast.success("Venue booked successfully");
      onBooked?.();
      onClose();
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Failed to book venue. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full text-black">
        <h2 className="text-lg font-semibold">{venue.name}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {venue.city} · {eventType} · up to {venue.capacity} guests · ₹
          {venue.pricePerDay.toLocaleString()} per day
        </p>

        <label className="block text-sm font-medium mb-1">Number of guests</label>
        <input
          type="number"
          min={1}
          value={guestsText}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setGuestsText(e.target.value.replace(/\D/g, ""))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        {tooMany && (
          <p className="mt-1 text-xs text-red-600">
            This venue holds up to {venue.capacity} guests. You entered {guests}.
          </p>
        )}

        <label className="block text-sm font-medium mt-4 mb-1">Date</label>
        <input
          type="date"
          min={todayLocal()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />

        <label className="block text-sm font-medium mt-4 mb-1">Time slot</label>
        <div className="flex gap-2">
          {SLOTS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSlot(s.value)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                slot === s.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {serverError && (
          <p className="mt-4 text-sm text-red-600">{serverError}</p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300"
          >
            Cancel
          </button>
          <Button onClick={handleSubmit} disabled={!canSubmit} loading={submitting}>
            Confirm booking
          </Button>
        </div>
      </div>
    </div>
  );
}

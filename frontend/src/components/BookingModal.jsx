export default function BookingModal({ event, seats, submitting, onConfirm, onClose }) {
  const total = (event.price || 0) * seats;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Confirm Booking</h2>
        <p className="text-sm text-gray-500 mb-4">{event.name}</p>

        <div className="space-y-2 text-sm border-t border-b border-gray-100 py-4 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Seats</span>
            <span className="text-gray-900 font-medium">{seats}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Price per seat</span>
            <span className="text-gray-900 font-medium">
              {event.price > 0 ? `₹${event.price}` : "Free"}
            </span>
          </div>
          <div className="flex justify-between text-base pt-1">
            <span className="text-gray-700 font-medium">Total</span>
            <span className="text-gray-900 font-semibold">
              {total > 0 ? `₹${total}` : "Free"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-4 py-2 text-sm disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-lg px-4 py-2 text-sm"
          >
            {submitting ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

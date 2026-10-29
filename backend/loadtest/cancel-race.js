const BASE = "http://localhost:5000/api";
const N = 20, SEATS = 5;

const call = async (method, path, body, token) => {
  const r = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let d = null; try { d = await r.json(); } catch {}
  return { status: r.status, d };
};
const seatsOf = (d) => d?.data?.availableSeats ?? d?.availableSeats ?? d?.data?.event?.availableSeats;

const email = `race${Date.now()}@test.com`;
const reg = await call("POST", "/auth/register", { name: "Race Test", email, password: "Test@1234" });
const token = reg.d?.token || reg.d?.data?.token;
if (!token) { console.log("Register failed:", reg.status, JSON.stringify(reg.d)); process.exit(1); }

const ev = await call("GET", "/events");
const list = Array.isArray(ev.d) ? ev.d : (ev.d?.data?.events || ev.d?.data || ev.d?.events || []);
const event = list.find((e) => e.availableSeats >= SEATS);
if (!event) { console.log("No event with enough seats. Response:", JSON.stringify(ev.d).slice(0, 300)); process.exit(1); }

const book = await call("POST", "/bookings", { eventId: event._id, seats: SEATS }, token);
const bookingId = book.d?.data?._id || book.d?._id || book.d?.booking?._id || book.d?.data?.booking?._id;
if (!bookingId) { console.log("Booking failed:", book.status, JSON.stringify(book.d)); process.exit(1); }

const before = seatsOf((await call("GET", `/events/${event._id}`)).d);
console.log(`Event "${event.name}": seats after booking = ${before}`);

const results = await Promise.all(
  Array.from({ length: N }, () => call("DELETE", `/bookings/${bookingId}`, null, token).then((r) => r.status))
);
const counts = results.reduce((a, s) => ((a[s] = (a[s] || 0) + 1), a), {});
console.log("Cancel status codes:", counts);

const after = seatsOf((await call("GET", `/events/${event._id}`)).d);
console.log(`Seats after ${N} simultaneous cancels = ${after}`);
console.log(`Expected = ${before + SEATS} (released once). Anything higher means the race bug is real.`);

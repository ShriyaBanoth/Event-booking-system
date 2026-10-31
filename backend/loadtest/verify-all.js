import "dotenv/config";
import mongoose from "mongoose";
import Event from "../models/Event.js";

const BASE = "http://localhost:5000/api";
const call = async (method, path, body, token) => {
  const r = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let d = null; try { d = await r.json(); } catch {}
  return { status: r.status, d };
};
const seatsNow = async (id) => (await Event.findById(id)).availableSeats;
const ok = (s) => s === 200 || s === 201;
const check = (name, pass, detail = "") => console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  -> " + detail : ""}`);
const mkEvent = (over) => Event.create({
  name: "TEMP verify event", description: "temporary test event", venue: "Test Venue",
  category: "Music", price: 100, totalSeats: 10, availableSeats: 10,
  date: new Date(Date.now() + 7 * 864e5), ...over,
});

await mongoose.connect(process.env.MONGO_URI);
const temps = [];
try {
  const reg = await call("POST", "/auth/register", { name: "Verify", email: `verify${Date.now()}@test.com`, password: "Test@1234" });
  const token = reg.d?.token || reg.d?.data?.token;
  if (!token) throw new Error("Register failed: " + reg.status + " " + JSON.stringify(reg.d));

  // 1. Normal booking
  const e1 = await mkEvent({ totalSeats: 50, availableSeats: 50 }); temps.push(e1._id);
  const b1 = await call("POST", "/bookings", { eventId: e1._id, seats: 2 }, token);
  check("Normal booking succeeds and takes 2 seats", ok(b1.status) && (await seatsNow(e1._id)) === 48, `status ${b1.status}, seats ${await seatsNow(e1._id)}`);

  // 2. Overbooking race: 30 parallel 1-seat bookings on a 10-seat event
  const e2 = await mkEvent({ totalSeats: 10, availableSeats: 10 }); temps.push(e2._id);
  const res = await Promise.all(Array.from({ length: 30 }, () => call("POST", "/bookings", { eventId: e2._id, seats: 1 }, token)));
  const wins = res.filter((r) => ok(r.status)).length;
  const left = await seatsNow(e2._id);
  check("Booking race: exactly 10 of 30 succeed, 0 seats left", wins === 10 && left === 0, `successes ${wins}, seats left ${left}`);

  // 3. Past event is rejected
  const e3 = await mkEvent({ date: new Date(Date.now() - 864e5) }); temps.push(e3._id);
  const b3 = await call("POST", "/bookings", { eventId: e3._id, seats: 1 }, token);
  check("Past event booking rejected with 400", b3.status === 400 && (await seatsNow(e3._id)) === 10, `status ${b3.status}, message "${b3.d?.message}"`);

  // 4. Cancel race: 20 parallel cancels of one booking
  const e4 = await mkEvent({ totalSeats: 100, availableSeats: 100 }); temps.push(e4._id);
  const b4 = await call("POST", "/bookings", { eventId: e4._id, seats: 5 }, token);
  const id4 = b4.d?.data?._id || b4.d?._id || b4.d?.booking?._id || b4.d?.data?.booking?._id;
  const c = await Promise.all(Array.from({ length: 20 }, () => call("DELETE", `/bookings/${id4}`, null, token)));
  const cw = c.filter((r) => ok(r.status)).length;
  const after = await seatsNow(e4._id);
  check("Cancel race: exactly 1 of 20 succeeds, seats back to 100", cw === 1 && after === 100, `successes ${cw}, seats ${after}`);
} catch (e) {
  console.log("Script error:", e.message);
} finally {
  await Event.deleteMany({ _id: { $in: temps } });
  await mongoose.disconnect();
}

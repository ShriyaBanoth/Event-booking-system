import {
  startDb, stopDb, clearDb,
  registerUser, makeEvent, book, cancel, seatsLeft,
} from "./helpers.js";
import SeatQuota from "../models/SeatQuota.js";
import { MAX_SEATS_PER_USER_PER_EVENT } from "../services/bookingService.js";

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);
// The unique (user, event) index is what makes the counter safe, so make
// sure it exists even if clearDb dropped the collection.
beforeEach(() => SeatQuota.syncIndexes());

const quotaFor = async (eventId) => {
  const q = await SeatQuota.findOne({ event: eventId });
  return q ? q.seats : 0;
};

describe("per-user seat limit", () => {
  test("20 simultaneous 1-seat bookings by one user: exactly 10 succeed", async () => {
    const { token } = await registerUser();
    const event = await makeEvent(); // 100 seats, so only the user limit can stop them
    const results = await Promise.all(
      Array.from({ length: 20 }, () => book(token, event._id, 1))
    );
    const successes = results.filter((r) => r.status === 201).length;
    expect(successes).toBe(MAX_SEATS_PER_USER_PER_EVENT);
    expect(await seatsLeft(event._id)).toBe(100 - MAX_SEATS_PER_USER_PER_EVENT);
    expect(await quotaFor(event._id)).toBe(MAX_SEATS_PER_USER_PER_EVENT);
  });

  test("a single request above the limit is rejected without touching anything", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const res = await book(token, event._id, MAX_SEATS_PER_USER_PER_EVENT + 1);
    expect(res.status).toBe(400);
    expect(await seatsLeft(event._id)).toBe(100);
    expect(await SeatQuota.countDocuments({ event: event._id })).toBe(0);
  });

  test("cancelling releases the quota so the user can book again", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const first = await book(token, event._id, MAX_SEATS_PER_USER_PER_EVENT);
    expect(first.status).toBe(201);
    expect((await book(token, event._id, 1)).status).toBe(400);

    const res = await cancel(token, first.body.data.booking._id);
    expect(res.status).toBe(200);
    expect(await quotaFor(event._id)).toBe(0);

    const again = await book(token, event._id, MAX_SEATS_PER_USER_PER_EVENT);
    expect(again.status).toBe(201);
    expect(await quotaFor(event._id)).toBe(MAX_SEATS_PER_USER_PER_EVENT);
  });

  test("a failed booking does not leak quota", async () => {
    const { token } = await registerUser();
    const event = await makeEvent({ availableSeats: 3 });
    const res = await book(token, event._id, 5); // not enough event seats
    expect(res.status).toBe(400);
    expect(await quotaFor(event._id)).toBe(0);

    const ok = await book(token, event._id, 3);
    expect(ok.status).toBe(201);
    expect(await quotaFor(event._id)).toBe(3);
  });

  test("two users have independent limits", async () => {
    const a = await registerUser();
    const b = await registerUser();
    const event = await makeEvent();
    expect((await book(a.token, event._id, MAX_SEATS_PER_USER_PER_EVENT)).status).toBe(201);
    expect((await book(b.token, event._id, MAX_SEATS_PER_USER_PER_EVENT)).status).toBe(201);
    expect((await book(a.token, event._id, 1)).status).toBe(400);
    expect((await book(b.token, event._id, 1)).status).toBe(400);
    expect(await seatsLeft(event._id)).toBe(100 - 2 * MAX_SEATS_PER_USER_PER_EVENT);
  });
});

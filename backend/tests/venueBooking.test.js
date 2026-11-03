import {
  startDb, stopDb, clearDb,
  registerUser, app, request,
} from "./helpers.js";
import Venue from "../models/Venue.js";
import VenueBooking from "../models/VenueBooking.js";

const VENUE_BOOKINGS = "/api/venue-bookings";

beforeAll(async () => {
  await startDb();
  // Make sure the partial unique index exists before any test runs
  await VenueBooking.syncIndexes();
});
afterAll(stopDb);
beforeEach(clearDb);

const ymd = (offsetDays) =>
  new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const makeVenue = (overrides = {}) =>
  Venue.create({
    name: "Test Hall",
    city: "Mumbai",
    capacity: 100,
    pricePerDay: 50000,
    eventTypes: ["Wedding"],
    ...overrides,
  });

const bookVenue = (token, venueId, overrides = {}) =>
  request(app)
    .post(VENUE_BOOKINGS)
    .set("Authorization", `Bearer ${token}`)
    .send({
      venueId: String(venueId),
      guests: 50,
      eventType: "Wedding",
      eventDate: ymd(7),
      slot: "evening",
      ...overrides,
    });

const cancelVenue = (token, id) =>
  request(app)
    .delete(`${VENUE_BOOKINGS}/${id}`)
    .set("Authorization", `Bearer ${token}`);

describe("venue booking: validation", () => {
  test("books a venue with valid details", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue();
    const res = await bookVenue(token, venue._id);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("confirmed");
    expect(res.body.data.slot).toBe("evening");
  });

  test("guests above capacity are rejected with the capacity in the message", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue({ capacity: 100 });
    const res = await bookVenue(token, venue._id, { guests: 150 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/up to 100 guests/);
    expect(await VenueBooking.countDocuments()).toBe(0);
  });

  test("a past date is rejected", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue();
    const res = await bookVenue(token, venue._id, { eventDate: ymd(-3) });
    expect(res.status).toBe(400);
  });

  test("an unknown slot is rejected", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue();
    const res = await bookVenue(token, venue._id, { slot: "midnight" });
    expect(res.status).toBe(400);
  });

  test("a badly formatted date is rejected, not a server error", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue();
    const res = await bookVenue(token, venue._id, { eventDate: "next friday" });
    expect(res.status).toBe(400);
  });

  test("an unknown venue returns 404", async () => {
    const { token } = await registerUser();
    const res = await bookVenue(token, "64b7f1f1f1f1f1f1f1f1f1f1");
    expect(res.status).toBe(404);
  });
});

describe("venue booking: no double booking", () => {
  test("the same venue, date and slot cannot be booked twice", async () => {
    const a = await registerUser();
    const b = await registerUser();
    const venue = await makeVenue();
    expect((await bookVenue(a.token, venue._id)).status).toBe(201);
    const second = await bookVenue(b.token, venue._id);
    expect(second.status).toBe(409);
    expect(second.body.message).toMatch(/already booked/);
  });

  test("a different slot or a different date is still available", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue();
    expect((await bookVenue(token, venue._id)).status).toBe(201);
    expect((await bookVenue(token, venue._id, { slot: "morning" })).status).toBe(201);
    expect((await bookVenue(token, venue._id, { eventDate: ymd(8) })).status).toBe(201);
  });

  test("20 users racing for one slot: exactly 1 succeeds", async () => {
    const users = await Promise.all(Array.from({ length: 20 }, () => registerUser()));
    const venue = await makeVenue();
    const results = await Promise.all(users.map((u) => bookVenue(u.token, venue._id)));
    expect(results.filter((r) => r.status === 201).length).toBe(1);
    expect(results.filter((r) => r.status === 409).length).toBe(19);
    expect(await VenueBooking.countDocuments({ status: "confirmed" })).toBe(1);
  });
});

describe("venue booking: cancel", () => {
  test("cancelling frees the slot for someone else", async () => {
    const a = await registerUser();
    const b = await registerUser();
    const venue = await makeVenue();
    const first = await bookVenue(a.token, venue._id);
    expect(first.status).toBe(201);
    expect((await bookVenue(b.token, venue._id)).status).toBe(409);

    expect((await cancelVenue(a.token, first.body.data._id)).status).toBe(200);
    expect((await bookVenue(b.token, venue._id)).status).toBe(201);
  });

  test("cancelling twice is rejected; 20 simultaneous cancels: exactly 1 succeeds", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue();
    const created = await bookVenue(token, venue._id);
    const id = created.body.data._id;

    const results = await Promise.all(Array.from({ length: 20 }, () => cancelVenue(token, id)));
    expect(results.filter((r) => r.status === 200).length).toBe(1);
    expect((await cancelVenue(token, id)).status).toBe(400);
  });

  test("another user cannot cancel someone else's booking", async () => {
    const owner = await registerUser();
    const other = await registerUser();
    const venue = await makeVenue();
    const created = await bookVenue(owner.token, venue._id);
    const res = await cancelVenue(other.token, created.body.data._id);
    expect(res.status).toBe(403);
    expect((await VenueBooking.findById(created.body.data._id)).status).toBe("confirmed");
  });

  test("cannot cancel once the booked date has passed", async () => {
    const { token } = await registerUser();
    const venue = await makeVenue();
    const created = await bookVenue(token, venue._id);
    await VenueBooking.updateOne(
      { _id: created.body.data._id },
      { eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    );
    const res = await cancelVenue(token, created.body.data._id);
    expect(res.status).toBe(400);
  });
});

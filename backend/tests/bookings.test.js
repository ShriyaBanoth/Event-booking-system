import {
  startDb, stopDb, clearDb,
  registerUser, makeEvent, book, cancel, seatsLeft,
} from "./helpers.js";

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

describe("booking", () => {
  test("books seats and reduces availability", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const res = await book(token, event._id, 2);
    expect(res.status).toBe(201);
    expect(await seatsLeft(event._id)).toBe(98);
  });

  test("rejects a request for more seats than are left", async () => {
    const { token } = await registerUser();
    const event = await makeEvent({ availableSeats: 3 });
    const res = await book(token, event._id, 5);
    expect(res.status).toBe(400);
    expect(await seatsLeft(event._id)).toBe(3);
  });

  test("rejects booking a past event", async () => {
    const { token } = await registerUser();
    const event = await makeEvent({ date: new Date(Date.now() - 24 * 60 * 60 * 1000) });
    const res = await book(token, event._id, 1);
    expect(res.status).toBe(400);
    expect(await seatsLeft(event._id)).toBe(100);
  });

  test("30 simultaneous bookings on a 10-seat event: exactly 10 succeed", async () => {
    const { token } = await registerUser();
    const event = await makeEvent({ totalSeats: 10, availableSeats: 10 });
    const results = await Promise.all(
      Array.from({ length: 30 }, () => book(token, event._id, 1))
    );
    const successes = results.filter((r) => r.status === 201).length;
    expect(successes).toBe(10);
    expect(await seatsLeft(event._id)).toBe(0);
  });
});

describe("cancellation", () => {
  test("cancelling restores the seats", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const b = await book(token, event._id, 5);
    expect(await seatsLeft(event._id)).toBe(95);
    const res = await cancel(token, b.body.data.booking._id);
    expect(res.status).toBe(200);
    expect(await seatsLeft(event._id)).toBe(100);
  });

  test("cancelling twice is rejected and releases seats only once", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const b = await book(token, event._id, 5);
    const id = b.body.data.booking._id;
    expect((await cancel(token, id)).status).toBe(200);
    expect((await cancel(token, id)).status).toBe(400);
    expect(await seatsLeft(event._id)).toBe(100);
  });

  test("20 simultaneous cancels of one booking: exactly 1 succeeds", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const b = await book(token, event._id, 5);
    const id = b.body.data.booking._id;
    const results = await Promise.all(
      Array.from({ length: 20 }, () => cancel(token, id))
    );
    expect(results.filter((r) => r.status === 200).length).toBe(1);
    expect(await seatsLeft(event._id)).toBe(100);
  });
});

import {
  startDb, stopDb, clearDb,
  registerUser, makeEvent, book, cancel, seatsLeft,
} from "./helpers.js";
import Event from "../models/Event.js";
import SeatQuota from "../models/SeatQuota.js";

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

describe("cancellation window", () => {
  test("cannot cancel after the event has started; nothing is released", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const b = await book(token, event._id, 3);
    expect(b.status).toBe(201);

    // Move the event into the past
    await Event.updateOne(
      { _id: event._id },
      { date: new Date(Date.now() - 60 * 60 * 1000) }
    );

    const res = await cancel(token, b.body.data.booking._id);
    expect(res.status).toBe(400);
    expect(await seatsLeft(event._id)).toBe(97);
    const quota = await SeatQuota.findOne({ event: event._id });
    expect(quota.seats).toBe(3);
  });

  test("cancelling before the event starts still works", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const b = await book(token, event._id, 3);
    const res = await cancel(token, b.body.data.booking._id);
    expect(res.status).toBe(200);
    expect(await seatsLeft(event._id)).toBe(100);
  });
});

import {
  startDb, stopDb, clearDb,
  registerUser, makeEvent, book, seatsLeft,
} from "./helpers.js";

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

describe("booking limited only by remaining seats", () => {
  test("one booking can take every remaining seat", async () => {
    const { token } = await registerUser();
    const event = await makeEvent(); // 100 seats
    const res = await book(token, event._id, 100);
    expect(res.status).toBe(201);
    expect(await seatsLeft(event._id)).toBe(0);
  });

  test("more than the remaining seats is rejected, exactly the remaining is accepted", async () => {
    const { token } = await registerUser();
    const event = await makeEvent({ availableSeats: 50 });
    const tooMany = await book(token, event._id, 51);
    expect(tooMany.status).toBe(400);
    expect(await seatsLeft(event._id)).toBe(50);

    const exact = await book(token, event._id, 50);
    expect(exact.status).toBe(201);
    expect(await seatsLeft(event._id)).toBe(0);
  });

  test("the maximum shrinks as seats are taken", async () => {
    const a = await registerUser();
    const b = await registerUser();
    const event = await makeEvent(); // 100 seats
    expect((await book(a.token, event._id, 60)).status).toBe(201);
    expect((await book(b.token, event._id, 41)).status).toBe(400);
    expect((await book(b.token, event._id, 40)).status).toBe(201);
    expect(await seatsLeft(event._id)).toBe(0);
  });
});

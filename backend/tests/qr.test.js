import {
  startDb, stopDb, clearDb,
  registerUser, makeEvent, book, app, request,
} from "./helpers.js";

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

const getQr = (token, bookingId) =>
  request(app)
    .get(`/api/bookings/${bookingId}/qr`)
    .set("Authorization", `Bearer ${token}`);

describe("QR ticket", () => {
  test("owner gets a QR code for their booking", async () => {
    const { token } = await registerUser();
    const event = await makeEvent();
    const b = await book(token, event._id, 2);
    const res = await getQr(token, b.body.data.booking._id);
    expect(res.status).toBe(200);
    expect(res.body.data.qrCode.startsWith("data:image/png;base64,")).toBe(true);
  });

  test("another user cannot get a QR for someone else's booking", async () => {
    const owner = await registerUser();
    const other = await registerUser();
    const event = await makeEvent();
    const b = await book(owner.token, event._id, 2);
    const res = await getQr(other.token, b.body.data.booking._id);
    expect(res.status).toBe(404);
    expect(res.body.data?.qrCode).toBeUndefined();
  });

  test("a malformed booking id returns 404, not a server error", async () => {
    const { token } = await registerUser();
    const res = await getQr(token, "not-a-real-id");
    expect(res.status).toBe(404);
  });
});

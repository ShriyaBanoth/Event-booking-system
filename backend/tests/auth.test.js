import { startDb, stopDb, clearDb, app, request } from "./helpers.js";

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

const user = { name: "Asha", email: "asha@test.com", password: "Test@1234" };

describe("auth", () => {
  test("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeTruthy();
  });

  test("rejects a duplicate email", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(400);
  });

  test("logs in with the right password", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
  });

  test("rejects a wrong password with 401", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "WrongPass@1" });
    expect(res.status).toBe(401);
  });

  test("protected route returns 401 without a token", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.status).toBe(401);
  });
});

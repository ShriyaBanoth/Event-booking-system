import { jest } from "@jest/globals";
import { errorHandler } from "../middleware/errorMiddleware.js";

const run = (err, env) => {
  const prev = process.env.NODE_ENV;
  process.env.NODE_ENV = env;
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  let status;
  let body;
  const res = {
    statusCode: 200,
    status(code) { status = code; return this; },
    json(payload) { body = payload; return this; },
  };
  errorHandler(err, { id: "req-1" }, res, () => {});
  spy.mockRestore();
  process.env.NODE_ENV = prev;
  return { status, body };
};

describe("error handler", () => {
  test("production 500 hides internal details and the stack", () => {
    const { status, body } = run(new Error("E11000 collection secret_index"), "production");
    expect(status).toBe(500);
    expect(body.message).toBe("Internal Server Error");
    expect(body.stack).toBeUndefined();
  });

  test("production 4xx keeps its user-facing message", () => {
    const err = new Error("Not enough seats available.");
    err.statusCode = 400;
    const { status, body } = run(err, "production");
    expect(status).toBe(400);
    expect(body.message).toBe("Not enough seats available.");
  });

  test("non-production 500 still shows the real message for debugging", () => {
    const { body } = run(new Error("boom detail"), "development");
    expect(body.message).toBe("boom detail");
  });
});

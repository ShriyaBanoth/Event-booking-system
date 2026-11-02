import { app } from "./helpers.js";

describe("proxy configuration", () => {
  test("trusts exactly one proxy hop (Render)", () => {
    expect(app.get("trust proxy")).toBe(1);
  });
});

import crypto from "crypto";

// Attaches a short correlation ID to every request, exposed both on
// req.id (for logging) and as a response header (so a client/QA engineer
// can report "X-Request-Id: abc123" instead of "it broke sometime today").
export const requestId = (req, res, next) => {
  req.id = crypto.randomBytes(6).toString("hex");
  res.setHeader("X-Request-Id", req.id);
  next();
};

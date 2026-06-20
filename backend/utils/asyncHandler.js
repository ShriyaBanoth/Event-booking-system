// Wraps an async route handler so thrown errors are passed to next()
// and ultimately handled by the centralized errorHandler middleware.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

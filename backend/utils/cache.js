// A minimal in-memory cache with a time-to-live. Intentionally simple -
// for a single-instance deployment this avoids re-querying MongoDB for
// data that barely changes (like the list of event categories) on every
// request. Not a substitute for Redis in a multi-instance deployment,
// but a reasonable default here, and the interface (get/set) is shaped
// so swapping in a real cache later is a one-file change.
const store = new Map();

export const getCached = (key) => {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
};

export const setCached = (key, value, ttlMs = 60_000) => {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
};

export const clearCached = (key) => {
  store.delete(key);
};

import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global handling for the two failure modes individual pages shouldn't each
// have to reimplement:
//  1. No response at all (backend unreachable / network down) - every page
//     that calls the API would otherwise need its own "can't connect" copy.
//  2. A session that was valid when the page loaded but has since expired -
//     clear the dead token so the UI doesn't keep retrying with it, and
//     tell the person why, instead of leaving them looking at a silent failure.
let sessionExpiredToastShown = false;

api.interceptors.response.use(
  (response) => {
    sessionExpiredToastShown = false; // a successful request means we're not in a dead-session state anymore
    return response;
  },
  (error) => {
    if (!error.response) {
      toast.error("Can't reach the server. Check your connection and try again.");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      const hadToken = !!localStorage.getItem("token");
      localStorage.removeItem("token");

      // Only show the "session expired" toast once per dead session, and
      // only if there *was* a token (otherwise this is just a normal logged-out
      // 401, e.g. someone browsing /events without being logged in).
      if (hadToken && !sessionExpiredToastShown) {
        sessionExpiredToastShown = true;
        toast.error("Your session has expired. Please log in again.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;

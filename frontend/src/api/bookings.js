import api from "./axios";

export const createBookingRequest = (payload) => api.post("/bookings", payload);

export const getUserBookingsRequest = () => api.get("/bookings");

export const cancelBookingRequest = (id) => api.delete(`/bookings/${id}`);

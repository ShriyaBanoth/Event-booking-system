import api from "./axios";

export const createVenueBookingRequest = (data) =>
  api.post("/venue-bookings", data);

export const getVenueBookingsRequest = () =>
  api.get("/venue-bookings");

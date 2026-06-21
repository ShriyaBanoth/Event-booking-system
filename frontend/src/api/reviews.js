import api from "./axios";

export const createReviewRequest = (payload) => api.post("/reviews", payload);

export const getReviewsByEventRequest = (eventId) => api.get(`/reviews/event/${eventId}`);

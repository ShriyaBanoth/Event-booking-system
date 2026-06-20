import api from "./axios";

export const getEventsRequest = (params) => api.get("/events", { params });

export const getEventByIdRequest = (id) => api.get(`/events/${id}`);

export const getEventCategoriesRequest = () => api.get("/events/categories");

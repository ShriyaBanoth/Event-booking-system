import api from "./axios";

export const getVenueRecommendationsRequest = (params) =>
  api.get("/venues/recommendations", { params });

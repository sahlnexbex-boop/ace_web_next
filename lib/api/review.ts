import { apiRequest } from "./apiClients";

export const getReviews = async (
  page = 1,
  limit = 10,
  search = "",
  filters: { status?: string; course_id?: string } = {}
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (filters.status) params.append("status", filters.status);
  if (filters.course_id) params.append("course_id", filters.course_id);

  return apiRequest(`/api/reviews?${params.toString()}`, "GET");
};

export const getReviewById = async (id: number) =>
  apiRequest(`/api/reviews/${id}`, "GET");

export const createReview = (data: FormData) =>
  apiRequest("/api/reviews", "POST", data, true);

export const updateReview = (id: number, data: FormData) =>
  apiRequest(`/api/reviews/${id}`, "PUT", data, true);

export const deleteReview = (id: number) =>
  apiRequest(`/api/reviews/${id}`, "DELETE", undefined, true);

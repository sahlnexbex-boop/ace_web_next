import { apiRequest } from "./apiClients";

export const getTestimonials = async (
  page = 1,
  limit = 10,
  search = "",
  filters: { status?: string } = {}
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (filters.status) params.append("status", filters.status);

  return apiRequest(`/api/testimonials?${params.toString()}`, "GET");
};

export const getTestimonialById = async (id: number) =>
  apiRequest(`/api/testimonials/${id}`, "GET");

export const createTestimonial = (data: FormData) =>
  apiRequest("/api/testimonials", "POST", data, true);

export const updateTestimonial = (id: number, data: FormData) =>
  apiRequest(`/api/testimonials/${id}`, "PUT", data, true);

export const deleteTestimonial = (id: number) =>
  apiRequest(`/api/testimonials/${id}`, "DELETE", undefined, true);

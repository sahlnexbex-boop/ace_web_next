import { apiRequest } from "./apiClients";

export const getCarousels = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));

  return apiRequest(`/api/carousel?${params.toString()}`, "GET");
};

export const getCarouselById = (id: number) =>
  apiRequest(`/api/carousel/${id}`, "GET");

export const createCarousel = (data: FormData) =>
  apiRequest("/api/carousel", "POST", data, true);

export const updateCarousel = (id: number, data: FormData) =>
  apiRequest(`/api/carousel/${id}`, "PUT", data, true);

export const deleteCarousel = (id: number) =>
  apiRequest(`/api/carousel/${id}`, "DELETE", undefined, true);

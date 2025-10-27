import { apiRequest } from "./apiClients";

export const getNews = async (
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

  return apiRequest(`/api/news?${params.toString()}`, "GET");
};

export const getNewsById = (id: number) => apiRequest(`/api/news/${id}`, "GET");

export const createNews = (data: FormData) =>
  apiRequest("/api/news", "POST", data, true);

export const updateNews = (id: number, data: FormData) =>
  apiRequest(`/api/news/${id}`, "PUT", data, true);

export const deleteNews = (id: number) =>
  apiRequest(`/api/news/${id}`, "DELETE", undefined, true);

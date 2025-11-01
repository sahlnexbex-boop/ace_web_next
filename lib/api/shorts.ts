import { apiRequest } from "./apiClients";

export const getShorts = async (
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

  return apiRequest(`/api/shorts?${params.toString()}`, "GET");
};

export const getShortById = (id: number) =>
  apiRequest(`/api/shorts/${id}`, "GET");

export const createShort = (data: FormData) =>
  apiRequest("/api/shorts", "POST", data, true);

export const updateShort = (id: number, data: FormData) =>
  apiRequest(`/api/shorts/${id}`, "PUT", data, true);

export const deleteShort = (id: number) =>
  apiRequest(`/api/shorts/${id}`, "DELETE", undefined, true);

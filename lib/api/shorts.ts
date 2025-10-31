import { apiRequest } from "./apiClients";

// 🔹 Get all Shorts with pagination, search, and status filter
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

// 🔹 Get a single Shorts by ID
export const getShortById = (id: number) =>
  apiRequest(`/api/shorts/${id}`, "GET");

// 🔹 Create new Shorts (multipart/form-data)
export const createShort = (data: FormData) =>
  apiRequest("/api/shorts", "POST", data, true);

// 🔹 Update Shorts (multipart/form-data)
export const updateShort = (id: number, data: FormData) =>
  apiRequest(`/api/shorts/${id}`, "PUT", data, true);

// 🔹 Delete Shorts
export const deleteShort = (id: number) =>
  apiRequest(`/api/shorts/${id}`, "DELETE", undefined, true);

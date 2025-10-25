import { apiRequest } from "./apiClients";

export const getCurrentAffairs = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  category_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (category_id) params.append("category_id", String(category_id));

  return apiRequest(`/api/affairs?${params.toString()}`, "GET");
};

export const createCurrentAffair = (data: FormData) =>
  apiRequest("/api/affairs", "POST", data, true);

export const updateCurrentAffair = (id: number, data: FormData) =>
  apiRequest(`/api/affairs/${id}`, "PUT", data, true);

export const deleteCurrentAffair = (id: number) =>
  apiRequest(`/api/affairs/${id}`, "DELETE", undefined, true);

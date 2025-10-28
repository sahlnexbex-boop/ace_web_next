import { apiRequest } from "./apiClients";


export const getCurrentAffairs = async (
  page = 1,
  limit = 10,
  search = "",
  filters?: { status?: string | number; category_id?: string | number }
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (filters?.status !== undefined && filters.status !== "")
    params.append("status", String(filters.status));
  if (filters?.category_id)
    params.append("category_id", String(filters.category_id));

  return apiRequest(`/api/affairs?${params.toString()}`, "GET");
};

export const getCurrentAffairById = (id: number) =>
  apiRequest(`/api/affairs/${id}`, "GET");

export const createCurrentAffair = (data: FormData) =>
  apiRequest("/api/affairs", "POST", data, true);

export const updateCurrentAffair = (id: number, data: FormData) =>
  apiRequest(`/api/affairs/${id}`, "PUT", data, true);

export const deleteCurrentAffair = (id: number) =>
  apiRequest(`/api/affairs/${id}`, "DELETE", undefined, true);

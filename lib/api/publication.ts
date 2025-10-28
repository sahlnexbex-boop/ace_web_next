import { apiRequest } from "./apiClients";

export const getPublications = async (
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
  if (category_id !== undefined) params.append("category_id", String(category_id));

  return apiRequest(`/api/publication?${params.toString()}`, "GET");
};

export const getPublicationById = async (id: number) =>
  apiRequest(`/api/publication/${id}`, "GET");

export const createPublication = (data: FormData) =>
  apiRequest("/api/publication", "POST", data, true);

export const updatePublication = (id: number, data: FormData) =>
  apiRequest(`/api/publication/${id}`, "PUT", data, true);

export const deletePublication = (id: number) =>
  apiRequest(`/api/publication/${id}`, "DELETE", undefined, true);

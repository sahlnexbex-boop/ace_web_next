import { apiRequest } from "./apiClients";

export const getPublications = async (
  page = 1,
  limit = 10,
  search = "",
  category_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (category_id) params.append("category_id", String(category_id));

  return apiRequest(`/api/publication?${params.toString()}`, "GET");
};

export const createPublication = (data: FormData) =>
  apiRequest("/api/publication", "POST", data, true);

export const updatePublication = (id: number, data: FormData) =>
  apiRequest(`/api/publication/${id}`, "PUT", data, true);

export const deletePublication = (id: number) =>
  apiRequest(`/api/publication/${id}`, "DELETE", undefined, true);

export const getPublicationCategories = async () => {
  const res = await apiRequest("/api/course-category", "GET");
  return res.data || [];
};

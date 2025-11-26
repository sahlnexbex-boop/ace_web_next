import { apiRequest } from "./apiClients";

export const getToppers = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  category_id?: number,
  year?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (category_id) params.append("category_id", String(category_id));
  if (year) params.append("year", String(year));

  return apiRequest(`/api/topper?${params.toString()}`, "GET");
};

export const getTopperById = (id: number) =>
  apiRequest(`/api/topper/${id}`, "GET");

export const createTopper = (data: FormData) =>
  apiRequest("/api/topper", "POST", data, true);

export const updateTopper = (id: number, data: FormData) =>
  apiRequest(`/api/topper/${id}`, "PUT", data, true);

export const deleteTopper = (id: number) =>
  apiRequest(`/api/topper/${id}`, "DELETE", undefined, true);

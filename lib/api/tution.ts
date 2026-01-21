import { apiRequest } from "./apiClients";

const BASE_URL = "/api/tutions";

export const getTutions = (
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

  return apiRequest(`${BASE_URL}?${params.toString()}`, "GET");
};

export const getTutionById = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "GET");

export const createTution = (data: FormData) =>
  apiRequest(BASE_URL, "POST", data, true);

export const updateTution = (id: number, data: FormData) =>
  apiRequest(`${BASE_URL}/${id}`, "PUT", data, true);

export const deleteTution = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "DELETE", undefined, true);


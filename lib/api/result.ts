import { apiRequest } from "./apiClients";

export const getResults = async (
page = 1, limit = 10, search = "", status?: string, based_type?: string, result_type?: string, category_id?: string, p0?: string | undefined) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (based_type) params.append("based_type", based_type);
  if (result_type) params.append("result_type", result_type);
  if (category_id) params.append("category_id", category_id);

  return apiRequest(`/api/results?${params.toString()}`, "GET");
};

export const getResultById = (id: number) =>
  apiRequest(`/api/results/${id}`, "GET");

export const createResult = (data: FormData) =>
  apiRequest("/api/results", "POST", data, true);

export const updateResult = (id: number, data: FormData) =>
  apiRequest(`/api/results/${id}`, "PUT", data, true);

export const deleteResult = (id: number) =>
  apiRequest(`/api/results/${id}`, "DELETE", undefined, true);

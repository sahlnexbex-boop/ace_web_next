import { apiRequest } from "./apiClients";

export const getStudyServices = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  service_type?: number,
  category_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (service_type !== undefined && service_type >= 1 && service_type <= 5)
    params.append("service_type", String(service_type));
  if (category_id !== undefined) params.append("category_id", String(category_id));

  return apiRequest(`/api/study-service?${params.toString()}`, "GET");
};

export const getStudyServiceById = (id: number) =>
  apiRequest(`/api/study-service/${id}`, "GET");

export const createStudyService = (data: FormData) =>
  apiRequest("/api/study-service", "POST", data, true);

export const updateStudyService = (id: number, data: FormData) =>
  apiRequest(`/api/study-service/${id}`, "PUT", data, true);

export const deleteStudyService = (id: number) =>
  apiRequest(`/api/study-service/${id}`, "DELETE", undefined, true);

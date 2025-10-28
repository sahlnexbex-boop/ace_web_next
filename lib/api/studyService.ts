import { apiRequest } from "./apiClients";

export const getStudyServices = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  service_type?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (service_type !== undefined)
    params.append("service_type", String(service_type));

  return apiRequest(`/api/study-service?${params.toString()}`, "GET");
};

export const getStudyServiceById = async (id: number) =>
  apiRequest(`/api/study-service/${id}`, "GET");

export const createStudyService = (data: FormData) =>
  apiRequest("/api/study-service", "POST", data, true);

export const updateStudyService = (id: number, data: FormData) =>
  apiRequest(`/api/study-service/${id}`, "PUT", data, true);

export const deleteStudyService = (id: number) =>
  apiRequest(`/api/study-service/${id}`, "DELETE", undefined, true);

export const getStudyCategoryOptions = async () => {
  const res = await apiRequest("/api/course-category", "GET");
  return res.data || [];
};

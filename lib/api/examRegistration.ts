import { apiRequest } from "./apiClients";

const BASE_URL = "/api/exam-registration";

export const getExamRegistrations = (
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

export const getExamRegistrationById = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "GET");

export const createExamRegistration = (data: any) =>
  apiRequest(BASE_URL, "POST", data, false);

export const updateExamRegistration = (id: number, data: any) =>
  apiRequest(`${BASE_URL}/${id}`, "PUT", data, false);

export const deleteExamRegistration = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "DELETE");

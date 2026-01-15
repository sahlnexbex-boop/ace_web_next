import { apiRequest } from "./apiClients";

const BASE_URL = "/api/exam-registration";

/* ================= FETCH LIST ================= */
export const getExamRegistrations = (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  std_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (std_id !== undefined) params.append("std_id", String(std_id));

  return apiRequest(`${BASE_URL}?${params.toString()}`, "GET");
};

/* ================= CRUD ================= */
export const getExamRegistrationById = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "GET");

export const createExamRegistration = (data: any) =>
  apiRequest(BASE_URL, "POST", data, false);

export const updateExamRegistration = (id: number, data: any) =>
  apiRequest(`${BASE_URL}/${id}`, "PUT", data, false);

export const deleteExamRegistration = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "DELETE");

export const getHallTicketByRegistrationId = (id: number) =>
  apiRequest(`/api/exam-registration/hallticket/${id}`, "GET");

/* ================= DOWNLOAD (FETCH ONLY) ================= */
export const downloadExamRegistrationExcel = async (options?: {
  page?: number;
  limit?: number;
  exportAll?: boolean;
}) => {
  const params = new URLSearchParams();

  if (options?.exportAll) {
    params.append("export", "all");
  } else {
    params.append("page", String(options?.page || 1));
    params.append("limit", String(options?.limit || 10));
  }

  // ❗ ONLY fetch & return response
  return apiRequest(
    `${BASE_URL}/download-excel?${params.toString()}`,
    "GET"
  ) as Promise<Response>;
};

import { apiRequest } from "./apiClients";

const BASE_URL = "/api/tution-registration";

export const getTutionRegistrations = (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  request_status?: number,
  medium?: string,
  tution_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (request_status !== undefined)
    params.append("request_status", String(request_status));
  if (medium) params.append("medium", medium);
  if (tution_id !== undefined) params.append("tution_id", String(tution_id));

  return apiRequest(`${BASE_URL}?${params.toString()}`, "GET");
};

export const getTutionRegistrationById = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "GET");

export const createTutionRegistration = (data: any) =>
  apiRequest(BASE_URL, "POST", data, false);

export const updateTutionRegistration = (id: number, data: any) =>
  apiRequest(`${BASE_URL}/${id}`, "PUT", data, false);

export const deleteTutionRegistration = (id: number) =>
  apiRequest(`${BASE_URL}/${id}`, "DELETE");

export const downloadTutionRegistrationExcel = async (options?: {
  page?: number;
  limit?: number;
  exportAll?: boolean;
  search?: string;
  status?: number;
  request_status?: number;
  medium?: string;
  tution_id?: number;
}) => {
  const params = new URLSearchParams();

  if (options?.exportAll) {
    params.append("export", "all");
  } else {
    params.append("page", String(options?.page || 1));
    params.append("limit", String(options?.limit || 10));
  }

  if (options?.search) params.append("search", options.search);
  if (options?.status !== undefined)
    params.append("status", String(options.status));
  if (options?.request_status !== undefined)
    params.append("request_status", String(options.request_status));
  if (options?.medium) params.append("medium", options.medium);
  if (options?.tution_id !== undefined)
    params.append("tution_id", String(options.tution_id));

  const response = (await apiRequest(
    `${BASE_URL}/download-excel?${params.toString()}`,
    "GET"
  )) as Response;

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = options?.exportAll
    ? "tution_registrations_full.xlsx"
    : `tution_registrations_page_${options?.page || 1}.xlsx`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};

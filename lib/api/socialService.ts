import { apiRequest } from "./apiClients";

export const getSocialServices = async (
  page = 1,
  limit = 10,
  search = "",
  status?: string,
  date?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (date) params.append("date", date);

  return apiRequest(`/api/social-service?${params.toString()}`, "GET");
};

export const createSocialService = (data: FormData) =>
  apiRequest("/api/social-service", "POST", data, true);

export const updateSocialService = (id: number, data: FormData) =>
  apiRequest(`/api/social-service/${id}`, "PUT", data, true);

export const deleteSocialService = (id: number) =>
  apiRequest(`/api/social-service/${id}`, "DELETE", undefined, true);

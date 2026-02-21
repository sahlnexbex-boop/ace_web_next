import { apiRequest } from "./apiClients";

export const getDynamicEvents = async (
  page = 1,
  limit = 10,
  search = "",
  status?: string | number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined && status !== "") params.append("status", String(status));

  return apiRequest(`/api/dynamic-events?${params.toString()}`, "GET");
};

export const getDynamicEventById = async (id: number) =>
  apiRequest(`/api/dynamic-events/${id}`, "GET");

export const createDynamicEvent = (data: FormData) =>
  apiRequest("/api/dynamic-events", "POST", data, true);

export const updateDynamicEvent = (id: number, data: FormData) =>
  apiRequest(`/api/dynamic-events/${id}`, "PUT", data, true);

export const deleteDynamicEvent = (id: number) =>
  apiRequest(`/api/dynamic-events/${id}`, "DELETE", undefined, true);

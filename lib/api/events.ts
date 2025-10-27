import { apiRequest } from "./apiClients";

export const getEvents = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  event_type?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (event_type !== undefined) params.append("event_type", String(event_type));

  return apiRequest(`/api/events?${params.toString()}`, "GET");
};

export const createEvent = (data: FormData) =>
  apiRequest("/api/events", "POST", data, true);

export const updateEvent = (id: number, data: FormData) =>
  apiRequest(`/api/events/${id}`, "PUT", data, true);

export const deleteEvent = (id: number) =>
  apiRequest(`/api/events/${id}`, "DELETE", undefined, true);

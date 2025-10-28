import { apiRequest } from "./apiClients";

export const getVideoClasses = async (
  page = 1,
  limit = 10,
  search = "",
  category_id?: number,
  status?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (category_id) params.append("category_id", String(category_id));
  if (status !== undefined) params.append("status", String(status)); 

  return apiRequest(`/api/video-class?${params.toString()}`, "GET");
};

export const getVideoClassById = (id: number) =>
  apiRequest(`/api/video-class/${id}`, "GET");

export const createVideoClass = (data: FormData) =>
  apiRequest("/api/video-class", "POST", data, true);

export const updateVideoClass = (id: number, data: FormData) =>
  apiRequest(`/api/video-class/${id}`, "PUT", data, true);

export const deleteVideoClass = (id: number) =>
  apiRequest(`/api/video-class/${id}`, "DELETE", undefined, true);

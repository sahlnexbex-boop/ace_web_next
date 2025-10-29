import { apiRequest } from "./apiClients";

export const getSuccessStories = async (
  page = 1,
  limit = 10,
  search = "",
  year?: string | number,
  status?: number,
  course_category_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (year) params.append("year", String(year));
  if (status !== undefined) params.append("status", String(status));
  if (course_category_id !== undefined)
    params.append("course_category_id", String(course_category_id));

  return apiRequest(`/api/success-stories?${params.toString()}`, "GET");
};

export const getSuccessStoryById = (id: number) =>
  apiRequest(`/api/success-stories/${id}`, "GET");

export const createSuccessStory = (data: FormData) =>
  apiRequest("/api/success-stories", "POST", data, true);

export const updateSuccessStory = (id: number, data: FormData) =>
  apiRequest(`/api/success-stories/${id}`, "PUT", data, true);

export const deleteSuccessStory = (id: number) =>
  apiRequest(`/api/success-stories/${id}`, "DELETE", undefined, true);

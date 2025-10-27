import { apiRequest } from "./apiClients";

// ✅ Get all webinars (with filters)
export const getWebinars = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  course_category_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (course_category_id !== undefined)
    params.append("course_category_id", String(course_category_id));

  return apiRequest(`/api/webinars?${params.toString()}`, "GET");
};

export const createWebinar = (data: FormData) =>
  apiRequest("/api/webinars", "POST", data, true);

export const updateWebinar = (id: number, data: FormData) =>
  apiRequest(`/api/webinars/${id}`, "PUT", data, true);

export const deleteWebinar = (id: number) =>
  apiRequest(`/api/webinars/${id}`, "DELETE", undefined, true);

// ✅ Get course categories for dropdow
export const getCourseCategoryOptions = async () => {
  const res = await apiRequest("/api/course-category", "GET");
  return res.data || [];
};

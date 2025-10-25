import { apiRequest } from "./apiClients";

export const getCourseCategories = async (
  page = 1,
  limit = 10,
  search = "",
  type_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.append("search", search);
  if (type_id) params.append("type_id", String(type_id));
  return apiRequest(`/api/course-category?${params.toString()}`, "GET");
};

export const createCourseCategory = (data: FormData) =>
  apiRequest("/api/course-category", "POST", data, true);
export const updateCourseCategory = (id: number, data: FormData) =>
  apiRequest(`/api/course-category/${id}`, "PUT", data, true);
export const deleteCourseCategory = (id: number) =>
  apiRequest(`/api/course-category/${id}`, "DELETE");

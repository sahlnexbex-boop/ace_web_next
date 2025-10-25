import { apiRequest } from "./apiClients";

export const getCourses = async (
  page = 1,
  limit = 10,
  search = "",
  category_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.append("search", search);
  if (category_id) params.append("category_id", String(category_id));
  return apiRequest(`/api/courses?${params.toString()}`, "GET");
};

export const createCourse = (data: FormData) =>
  apiRequest("/api/courses", "POST", data, true);

export const updateCourse = (id: number, data: FormData) =>
  apiRequest(`/api/courses/${id}`, "PUT", data, true);

export const deleteCourse = (id: number) =>
  apiRequest(`/api/courses/${id}`, "DELETE", undefined, true);

export const getCourseCategoryOptions = async () => {
  const res = await apiRequest("/api/course-category", "GET");
  return res.data || [];
};

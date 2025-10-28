import { apiRequest } from "./apiClients";

export const getCourseCategories = async (
  page = 1,
  limit = 10,
  search = "",
  filters: { status?: string; type_id?: string } = {}
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);

  // ✅ Backend expects `type_id` and `status`
  if (filters.type_id) params.append("type_id", filters.type_id);
  if (filters.status) params.append("status", filters.status);

  return apiRequest(`/api/course-category?${params.toString()}`, "GET");
};

// ✅ Get Category by ID
export const getCourseCategoryById = async (id: number) =>
  apiRequest(`/api/course-category/${id}`, "GET");

// ✅ Create New Category
export const createCourseCategory = (data: FormData) =>
  apiRequest("/api/course-category", "POST", data, true);

// ✅ Update Category
export const updateCourseCategory = (id: number, data: FormData) =>
  apiRequest(`/api/course-category/${id}`, "PUT", data, true);

// ✅ Delete Category
export const deleteCourseCategory = (id: number) =>
  apiRequest(`/api/course-category/${id}`, "DELETE");

import { apiRequest } from "./apiClients";

// ✅ Get all course types (with pagination, search, and status filter)
export const getCourseTypes = async (
  page = 1,
  search = "",
  limit = 10,
  filters: Record<string, any> = {}
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  return apiRequest(`/api/course-types?${params.toString()}`, "GET");
};

export const getCourseTypeById = async (id: number) =>
  apiRequest(`/api/course-types/${id}`, "GET");

export const createCourseType = (data: any) =>
  apiRequest("/api/course-types", "POST", data);

export const updateCourseType = (id: number, data: any) =>
  apiRequest(`/api/course-types/${id}`, "PUT", data);

export const deleteCourseType = (id: number) =>
  apiRequest(`/api/course-types/${id}`, "DELETE");

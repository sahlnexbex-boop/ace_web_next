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

// ✅ Get single course type by ID
export const getCourseTypeById = async (id: number | string) =>
  apiRequest(`/api/course-types/${String(id)}`, "GET");

// ✅ Create course type
export const createCourseType = (data: any) =>
  apiRequest("/api/course-types", "POST", data);

// ✅ Update course type
export const updateCourseType = (id: number | string, data: any) =>
  apiRequest(`/api/course-types/${String(id)}`, "PUT", data);

// ✅ Delete course type
export const deleteCourseType = (id: number | string) =>
  apiRequest(`/api/course-types/${String(id)}`, "DELETE");

import { apiRequest } from "./apiClients";

export const getCourses = async (
  page = 1,
  limit = 10,
  search = "",
  filters: { status?: string; category_id?: string; v2_connected?: string } = {}
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (filters.category_id) params.append("category_id", filters.category_id);
  if (filters.status) params.append("status", filters.status);
  if (filters.v2_connected) params.append("v2_connected", filters.v2_connected);

  return apiRequest(`/api/courses?${params.toString()}`, "GET");
};

export const getCourseById = async (id: number, modules = false, chapters = false) => {
  const params = new URLSearchParams();
  if (modules) params.append("modules", "true");
  if (chapters) params.append("chapters", "true");
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/api/courses/${id}${query}`, "GET");
};

// get course by slug
export const getCourseBySlug = async (slug: string, modules = false, chapters = false) => {
  const params = new URLSearchParams();
  if (modules) params.append("modules", "true");
  if (chapters) params.append("chapters", "true");
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/api/courses/slug/${slug}${query}`, "GET");
};

export const createFullCourse = (data: FormData) =>
  apiRequest("/api/courses/full", "POST", data, true);

export const updateFullCourse = (id: number, data: FormData) =>
  apiRequest(`/api/courses/full/${id}`, "PUT", data, true);

export const createCourse = (data: FormData) =>
  apiRequest("/api/courses", "POST", data, true);

export const updateCourse = (id: number, data: FormData) =>
  apiRequest(`/api/courses/${id}`, "PUT", data, true);

export const deleteCourse = (id: number) =>
  apiRequest(`/api/courses/${id}`, "DELETE", undefined, true);

// export const getCourseCategoryOptions = async () =>
//   apiRequest("/api/course-category/options", "GET");

import { apiRequest } from "./apiClients";

export const getCourseTypes = async (page = 1, search = "", limit = 10) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append("search", search);
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

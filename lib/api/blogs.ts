import { apiRequest } from "./apiClients";

export const getBlogs = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  course_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (course_id !== undefined) params.append("course_id", String(course_id));

  return apiRequest(`/api/blogs?${params.toString()}`, "GET");
};

export const getBlogById = (id: number) =>
  apiRequest(`/api/blogs/${id}`, "GET");

export const getBlogBySlug = (slug: string) =>
  apiRequest(`/api/blogs/slug/${slug}`, "GET");

export const createBlog = (data: FormData) =>
  apiRequest("/api/blogs", "POST", data, true);

export const updateBlog = (id: number, data: FormData) =>
  apiRequest(`/api/blogs/${id}`, "PUT", data, true);

export const deleteBlog = (id: number) =>
  apiRequest(`/api/blogs/${id}`, "DELETE", undefined, true);

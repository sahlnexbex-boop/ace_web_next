import { apiRequest } from "./apiClients";

export const getRankHolders = async (
  page: number,
  limit: number,
  search?: string,
  status?: number,
  based_type?: number,
  course_id?: number,
  category_id?: number,
  year?: number,
) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));
  if (based_type !== undefined) params.append("based_type", String(based_type));
  if (course_id !== undefined) params.append("course_id", String(course_id));
  if (category_id !== undefined) params.append("category_id", String(category_id));
  if (year !== undefined) params.append("year", String(year));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rankholders?page=${page}&limit=${limit}&${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  return await res.json();
};

export const getRankHolderById = (id: number) =>
  apiRequest(`/api/rankholders/${id}`, "GET");

export const createRankHolder = (data: FormData) =>
  apiRequest("/api/rankholders", "POST", data, true); 

export const updateRankHolder = (id: number, data: FormData) =>
  apiRequest(`/api/rankholders/${id}`, "PUT", data, true); 

export const deleteRankHolder = (id: number) =>
  apiRequest(`/api/rankholders/${id}`, "DELETE", undefined, false);

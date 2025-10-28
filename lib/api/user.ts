import { apiRequest } from "@/lib/api/apiClients";

export const getUsers = async (page = 1, search = "", limit = 10) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append("search", search);
  return apiRequest(`/api/users?${params.toString()}`, "GET");
};

export const getUserById = async (id: number | string) => {
  return apiRequest(`/api/users/${id}`, "GET");
};

export const createUser = async (payload: any) => {
  return apiRequest("/api/users", "POST", payload);
};

export const updateUser = async (id: number | string, payload: any) => {
  return apiRequest(`/api/users/${id}`, "PUT", payload);
};

export const deleteUser = async (id: number | string) => {
  return apiRequest(`/api/users/${id}`, "DELETE");
};

import { apiRequest } from "@/lib/api/apiClients";

export const getUsers = async (
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

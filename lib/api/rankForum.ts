import { apiRequest } from "./apiClients";

//  LIST – needs token
export const getRankForums = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  department_id?: number,
  request_status?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined && !Number.isNaN(status))
    params.append("status", String(status));
  if (department_id !== undefined && !Number.isNaN(department_id))
    params.append("department_id", String(department_id));
  if (request_status !== undefined && !Number.isNaN(request_status))
    params.append("request_status", String(request_status));

  return apiRequest(
    `/api/rank-forum?${params.toString()}`,
    "GET",
    undefined,
    false, // isFormData ❌
    false // skipAuth ❌ (token REQUIRED)
  );
};

//  SINGLE GET – needs token
export const getRankForumById = (id: number) =>
  apiRequest(`/api/rank-forum/${id}`, "GET", undefined, false, false);

// CREATE – PUBLIC + FormData
export const createRankForum = (data: FormData) =>
  apiRequest("/api/rank-forum", "POST", data, true, true);

// UPDATE – needs token + FormData
export const updateRankForum = (id: number, data: FormData) =>
  apiRequest(`/api/rank-forum/${id}`, "PUT", data, true, false);

//  DELETE – needs token
export const deleteRankForum = (id: number) =>
  apiRequest(`/api/rank-forum/${id}`, "DELETE", undefined, false, false);

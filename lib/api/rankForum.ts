import { apiRequest } from "./apiClients";

//  LIST – needs accessToken
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
  if (status !== undefined) params.append("status", String(status));
  if (department_id !== undefined)
    params.append("department_id", String(department_id));
  if (request_status !== undefined)
    params.append("request_status", String(request_status));

  return apiRequest(
    `/api/rank-forum?${params.toString()}`,
    "GET",
    undefined,
    true
  );
};

//  SINGLE GET – needs accessToken
export const getRankForumById = (id: number) =>
  apiRequest(`/api/rank-forum/${id}`, "GET", undefined, true);

// CREATE – NO accessToken
export const createRankForum = (data: FormData) =>
  apiRequest("/api/rank-forum", "POST", data, false);

//  UPDATE – needs accessToken
export const updateRankForum = (id: number, data: FormData) =>
  apiRequest(`/api/rank-forum/${id}`, "PUT", data, true);

//  DELETE – needs accessToken
export const deleteRankForum = (id: number) =>
  apiRequest(`/api/rank-forum/${id}`, "DELETE", undefined, true);

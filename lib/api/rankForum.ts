import { apiRequest } from "./apiClients";

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    false, 
    false 
  );
};

export const getRankForumById = (id: number) =>
  apiRequest(`/api/rank-forum/${id}`, "GET", undefined, false, false);

export const createRankForum = (data: FormData) =>
  apiRequest("/api/rank-forum", "POST", data, true, true);

export const updateRankForum = (id: number, data: FormData) =>
  apiRequest(`/api/rank-forum/${id}`, "PUT", data, true, false);

export const deleteRankForum = (id: number) =>
  apiRequest(`/api/rank-forum/${id}`, "DELETE", undefined, false, false);

export const downloadRankForumExcel = async (options?: {
  page?: number;
  limit?: number;
  exportAll?: boolean;
}) => {
  const params = new URLSearchParams();

  if (options?.exportAll) {
    params.append("export", "all");
  } else {
    params.append("page", String(options?.page || 1));
    params.append("limit", String(options?.limit || 10));
  }

  const response = await fetch(`${base_url}/api/rank-forum/export?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download Excel file");
  }

  const blob = await response.blob();

  // Trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = options?.exportAll
    ? "rank_forum_full.xlsx"
    : `rank_forum_page_${options?.page || 1}.xlsx`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};

import { apiRequest } from "./apiClients";

const BASE_URL = "/api/dynamic-submissions";

export interface Submission {
  submission_id: number;
  dynmc_event_id: number;
  created_at: string;
  updated_at: string;
  event?: {
    dynmc_event_title: string;
  };
  values?: any[]; // For detailed view
}

export async function getSubmissions(
  page = 1,
  limit = 10,
  search = "",
  event_id?: number,
  status?: number
) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) query.append("search", search);
  if (event_id) query.append("event_id", String(event_id));
  if (status !== undefined) query.append("status", String(status));

  return await apiRequest(`${BASE_URL}?${query.toString()}`, "GET");
}

export async function getSubmissionById(id: number) {
  return await apiRequest(`${BASE_URL}/${id}`, "GET");
}

// Submissions are usually created by public users, but if needed:
export async function createSubmission(data: FormData) {
  // Use FormData for file uploads
  return await apiRequest(BASE_URL, "POST", data, true);
}

export async function updateSubmission(id: number, data: FormData) {
  return await apiRequest(`${BASE_URL}/${id}`, "PUT", data, true);
}

export async function deleteSubmission(id: number) {
  return await apiRequest(`${BASE_URL}/${id}`, "DELETE");
}

export const downloadSubmissionsExcel = async (options?: {
    page?: number;
    limit?: number;
    exportAll?: boolean;
    search?: string;
    event_id?: number;
}) => {
    const params = new URLSearchParams();

    if (options?.exportAll) {
        params.append("export", "all");
    } else {
        params.append("page", String(options?.page || 1));
        params.append("limit", String(options?.limit || 10));
    }

    if (options?.search) params.append("search", options.search);
    if (options?.event_id) params.append("event_id", String(options.event_id));

    const response = (await apiRequest(
        `${BASE_URL}/download-excel?${params.toString()}`,
        "GET"
    )) as Response;

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `submissions_${options?.event_id ? `event_${options.event_id}_` : ''}${options?.exportAll ? "full" : `page_${options?.page || 1}`}.xlsx`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
};

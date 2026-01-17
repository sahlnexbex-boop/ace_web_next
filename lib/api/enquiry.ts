import { apiRequest } from "./apiClients";

const BASE_URL = "/api/enquiry";

export async function getEnquiries(
  page = 1,
  limit = 10,
  search = "",
  status?: number,
  enquiry_type?: number,
  enquiry_status?: number
) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) query.append("search", search);
  if (status !== undefined) query.append("status", String(status));
  if (enquiry_type !== undefined) query.append("enquiry_type", String(enquiry_type));
  if (enquiry_status !== undefined)
    query.append("enquiry_status", String(enquiry_status));

  return await apiRequest(`${BASE_URL}?${query.toString()}`, "GET");
}

export async function getEnquiryById(id: number) {
  return await apiRequest(`${BASE_URL}/${id}`, "GET");
}

export async function createEnquiry(data: any) {
  return await apiRequest(BASE_URL, "POST", data, false);
}

export async function updateEnquiry(id: number, data: any) {
  return await apiRequest(`${BASE_URL}/${id}`, "PUT", data, false);
}

export async function deleteEnquiry(id: number) {
  return await apiRequest(`${BASE_URL}/${id}`, "DELETE");
}

export const downloadEnquiryExcel = async (options?: {
  page?: number;
  limit?: number;
  exportAll?: boolean;
  search?: string;
  status?: number;
  enquiry_type?: number;
  enquiry_status?: number;
}) => {
  const params = new URLSearchParams();

  if (options?.exportAll) {
    params.append("export", "all");
  } else {
    params.append("page", String(options?.page || 1));
    params.append("limit", String(options?.limit || 10));
  }

  if (options?.search) params.append("search", options.search);
  if (options?.status !== undefined) params.append("status", String(options.status));
  if (options?.enquiry_type !== undefined) params.append("enquiry_type", String(options.enquiry_type));
  if (options?.enquiry_status !== undefined) params.append("enquiry_status", String(options.enquiry_status));

  const response = (await apiRequest(
    `${BASE_URL}/download-excel?${params.toString()}`,
    "GET"
  )) as Response;

  const blob = await response.blob();

  // Trigger browser download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = options?.exportAll
    ? "enquiries_full.xlsx"
    : `enquiries_page_${options?.page || 1}.xlsx`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};
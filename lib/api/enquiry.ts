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

export async function createEnquiry(data: any) {
  return await apiRequest(BASE_URL, "POST", data, false);
}

export async function updateEnquiry(id: number, data: any) {
  return await apiRequest(`${BASE_URL}/${id}`, "PUT", data, false);
}

export async function deleteEnquiry(id: number) {
  return await apiRequest(`${BASE_URL}/${id}`, "DELETE");
}

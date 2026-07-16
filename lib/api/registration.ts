import { apiRequest } from "./apiClients";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const ACEAPP_V2_URL = process.env.NEXT_PUBLIC_ACEAPP_V2_URL || "";

/* LIST */
export const getOnlineRegistrations = async (
  page = 1,
  limit = 10,
  search = "",
  department_id?: number,
  course_id?: number,
  apply_status?: string,
  branch_id?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (department_id) params.append("department_id", String(department_id));
  if (course_id) params.append("course_id", String(course_id));
  if (apply_status) params.append("apply_status", apply_status);
  if (branch_id) params.append("branch_id", String(branch_id));

  return apiRequest(
    `/api/online-registration?${params.toString()}`,
    "GET"
  );
};

/* SINGLE */
export const getOnlineRegistrationById = (id: number) =>
  apiRequest(`/api/online-registration/${id}`, "GET");

/* CREATE */
export const createOnlineRegistration = (data: FormData) =>
  apiRequest(`${ACEAPP_V2_URL}/student/registration-requests/`, "POST", data, true);

/* UPDATE */
export const updateOnlineRegistration = (id: number, data: FormData) =>
  apiRequest(`/api/online-registration/${id}`, "PUT", data, true);

/* DELETE */
export const deleteOnlineRegistration = (id: number) =>
  apiRequest(`/api/online-registration/${id}`, "DELETE", undefined, true);

// excel 
export const downloadOnlineRegistrationExcel = async (options?: {
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

  //  Use apiRequest so token + base URL works
  const response = (await apiRequest(
    `/api/online-registration/download-excel?${params.toString()}`,
    "GET"
  )) as Response;

  const blob = await response.blob();

  //  Trigger browser download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = options?.exportAll
    ? "online_registrations_full.xlsx"
    : `online_registrations_page_${options?.page || 1}.xlsx`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};

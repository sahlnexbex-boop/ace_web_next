import { apiRequest } from "./apiClients";

/* LIST */
export const getOnlineRegistrations = async (
  page = 1,
  limit = 10,
  search = "",
  department_id?: number,
  course_id?: number,
  apply_status?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (department_id) params.append("department_id", String(department_id));
  if (course_id) params.append("course_id", String(course_id));
  if (apply_status) params.append("apply_status", apply_status);

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
  apiRequest("/api/online-registration", "POST", data, true);

/* UPDATE */
export const updateOnlineRegistration = (id: number, data: FormData) =>
  apiRequest(`/api/online-registration/${id}`, "PUT", data, true);

/* DELETE */
export const deleteOnlineRegistration = (id: number) =>
  apiRequest(`/api/online-registration/${id}`, "DELETE", undefined, true);

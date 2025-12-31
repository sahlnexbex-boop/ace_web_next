import { apiRequest } from "./apiClients";

//  LIST STUDENTS 
export const getStudents = async (
  page = 1,
  limit = 10,
  search = "",
  status?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (status !== undefined) params.append("status", String(status));

  return apiRequest(`/api/student?${params.toString()}`, "GET", undefined, true);
};

//  GET SINGLE STUDENT
export const getStudentById = (id: number) =>
  apiRequest(`/api/student/${id}`, "GET", undefined, true);

//  CREATE STUDENT
export const createStudent = (data: FormData) =>
  apiRequest("/api/student", "POST", data, true);

//  UPDATE STUDENT
export const updateStudent = (id: number, data: FormData) =>
  apiRequest(`/api/student/${id}`, "PUT", data, true);

//  DELETE STUDENT
export const deleteStudent = (id: number) =>
  apiRequest(`/api/student/${id}`, "DELETE", undefined, true);

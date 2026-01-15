import { jwtDecode } from "jwt-decode";

const STUDENT_ID_KEY = "std_id";

interface StudentJwtPayload {
  std_id: number;
  std_email: string;
  iat: number;
  exp: number;
}

export const storeStudentIdFromToken = (token: string) => {
  try {
    const decoded = jwtDecode<StudentJwtPayload>(token);
    if (decoded?.std_id) {
      localStorage.setItem(STUDENT_ID_KEY, String(decoded.std_id));
    }
  } catch (err) {
    console.error("Failed to decode student token", err);
  }
};

export const getStudentId = () => {
  return localStorage.getItem(STUDENT_ID_KEY);
};

export const clearStudentId = () => {
  localStorage.removeItem(STUDENT_ID_KEY);
};

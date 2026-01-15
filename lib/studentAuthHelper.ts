import { jwtDecode } from "jwt-decode";

const STUDENT_ID_KEY = "std_id";

interface StudentJwtPayload {
  std_id: number;
  std_email: string;
  iat: number;
  exp: number;
}

/* ================= STORE ================= */
export const storeStudentIdFromToken = (token: string) => {
  if (typeof window === "undefined") return;

  try {
    const decoded = jwtDecode<StudentJwtPayload>(token);
    if (decoded?.std_id) {
      localStorage.setItem(STUDENT_ID_KEY, String(decoded.std_id));
    }
  } catch (err) {
    console.error("Failed to decode student token", err);
  }
};

/* ================= GET ================= */
export const getStudentId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STUDENT_ID_KEY);
};

/* ================= CLEAR ================= */
export const clearStudentId = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STUDENT_ID_KEY);
};

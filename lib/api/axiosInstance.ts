import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    // Only run on client
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 ONLY in browser
    if (
      error?.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem("accessToken");

      // Hard redirect avoids router dependency in shared lib
      window.location.href = "/admin/auth/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

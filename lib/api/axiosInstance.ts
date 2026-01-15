import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor (This was already safe ✅)
axiosInstance.interceptors.request.use(
  (config) => {
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

// Response Interceptor (Fixed 🛠️)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if we are in the browser before using window or localStorage
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/admin/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
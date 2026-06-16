import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://artisanhandicraftmarketplace.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage (fallback if cookies aren't used)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't log error for check-auth since it's normal for guests
      if (!error.config?.url?.includes("/common-api/check-auth")) {
        console.error("Unauthorized access");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
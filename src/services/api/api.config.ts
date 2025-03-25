import axios from "axios";
import { getRefreshToken } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Try to get token
    const token = await getRefreshToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle unauthorized errors
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Force logout if auth errors occur
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

// Error handler helper
export const handleApiError = (error: any) => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred";
  return errorMessage;
};

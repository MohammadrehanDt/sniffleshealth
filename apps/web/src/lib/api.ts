import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || "Request failed";
    const status = error.response?.status || 500;
    
    // Transform to our standard ApiError
    return Promise.reject(new ApiError(message, status));
  }
);

export default api;

/**
 * Compatibility wrapper for existing fetch-based apiRequest calls.
 * This translates Fetch API options (method, body, headers, token) to Axios.
 */
export async function apiRequest<T>(path: string, options: any = {}): Promise<T> {
  const config: AxiosRequestConfig = {
    url: path,
    method: options.method || "GET",
    headers: options.headers || {},
  };

  if (options.body) {
    try {
      config.data = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    } catch {
      config.data = options.body;
    }
  }

  // If token is explicitly passed in options, use it (overriding interceptor if needed)
  if (options.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${options.token}`,
    };
  }

  try {
    const response = await api(config);
    return response.data as T;
  } catch (error) {
    throw error;
  }
}

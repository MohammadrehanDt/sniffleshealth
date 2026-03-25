import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { clearSessionFlag, hasSession } from "@/features/auth/hooks/useAuth";

// ── Axios instance ──────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ── Response interceptor: refresh token rotation ────────────────────────────

let isRefreshing = false;
let pendingQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown) {
  for (const { resolve, reject } of pendingQueue) {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  }
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const requestUrl = originalRequest?.url ?? "";
    const isRefreshEndpoint = requestUrl === "/auth/refresh";
    const isPublicAuthEndpoint = [
      "/auth/login",
      "/auth/register",
      "/auth/request-otp",
      "/auth/verify-otp",
      "/auth/complete-signup",
      "/auth/forgot-password",
      "/auth/reset-password",
    ].includes(requestUrl);
    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      hasSession() &&
      !originalRequest._retry &&
      !isRefreshEndpoint &&
      !isPublicAuthEndpoint;

    if (shouldAttemptRefresh) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearSessionFlag();
        useAuthStore.getState().clearSession();
        return Promise.reject(new ApiError("Session expired", 401));
      } finally {
        isRefreshing = false;
      }
    }

    // Default error normalization
    const message =
      error.response?.data?.message ?? error.message ?? "Request failed";
    const status = error.response?.status ?? 0;

    return Promise.reject(new ApiError(message, status));
  },
);

// ── Error class ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

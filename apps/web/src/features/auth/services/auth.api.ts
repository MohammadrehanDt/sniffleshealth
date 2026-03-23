import type {
  AuthResponse,
  AuthUser,
  CompleteSignupPayload,
  LoginPayload,
  OtpChallengeResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RequestOtpPayload,
  VerifyOtpResponse,
  VerifyOtpPayload,
} from "@sniffles/types";
import { api } from "@/lib/api";

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  requestOtp: (payload: RequestOtpPayload) =>
    api
      .post<OtpChallengeResponse>("/auth/request-otp", payload)
      .then((r) => r.data),

  verifyOtp: (payload: VerifyOtpPayload) =>
    api
      .post<VerifyOtpResponse>("/auth/verify-otp", payload)
      .then((r) => r.data),

  completeSignup: (payload: CompleteSignupPayload) =>
    api
      .post<AuthResponse>("/auth/complete-signup", payload)
      .then((r) => r.data),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  refresh: (payload: RefreshTokenPayload) =>
    api
      .post<RefreshTokenResponse>("/auth/refresh", payload)
      .then((r) => r.data),

  me: () => api.get<AuthUser>("/auth/me").then((r) => r.data),
};

import type {
  AuthResponse,
  AuthUser,
  CompleteSignupPayload,
  LoginPayload,
  OtpChallengeResponse,
  RequestOtpPayload,
  VerifyOtpResponse,
  VerifyOtpPayload,
} from "@sniffles/types";
import { apiRequest } from "@/lib/api";

export const authApi = {
  requestOtp(payload: RequestOtpPayload) {
    return apiRequest<OtpChallengeResponse>("/auth/request-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  verifyOtp(payload: VerifyOtpPayload) {
    return apiRequest<VerifyOtpResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  completeSignup(payload: CompleteSignupPayload) {
    return apiRequest<AuthResponse>("/auth/complete-signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginPayload) {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  me(token: string) {
    return apiRequest<AuthUser>("/auth/me", {
      method: "GET",
      token,
    });
  },
};

import type { AuthUser, UserRole } from "./user.types";

export interface RequestOtpPayload {
  email: string;
  role: UserRole;
  fullName?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  email: string;
  verified: boolean;
  role: UserRole;
}

export interface CompleteSignupPayload {
  email: string;
  otp: string;
  password: string;
  fullName?: string;
  npiNumber?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  npiNumber?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface RefreshTokenResponse {
  success: boolean;
}

export interface OtpChallengeResponse {
  email: string;
  role: UserRole;
  expiresInMinutes: number;
  otpCode?: string;
}

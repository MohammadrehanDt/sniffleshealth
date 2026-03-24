import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type {
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  RegisterPayload,
  RequestOtpPayload,
  CompleteSignupPayload,
  VerifyOtpPayload,
} from "@sniffles/types";
import { authApi } from "../services/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { getDefaultRouteForRole } from "../utils/auth-routing";

export const authKeys = {
  me: ["auth", "me"] as const,
};

const SESSION_FLAG = "sniffles_session";

export function setSessionFlag() {
  localStorage.setItem(SESSION_FLAG, "1");
}

export function clearSessionFlag() {
  localStorage.removeItem(SESSION_FLAG);
}

export function hasSession() {
  return localStorage.getItem(SESSION_FLAG) === "1";
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.me(),
    enabled: hasSession(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin(options?: { redirectTo?: string | null }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setSessionFlag();
      setUser(data.user);
      setBootstrapped(true);
      queryClient.setQueryData(authKeys.me, data.user);
      const target =
        options?.redirectTo ?? getDefaultRouteForRole(data.user.role);
      navigate(target, { replace: true });
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setSessionFlag();
      setUser(data.user);
      setBootstrapped(true);
      queryClient.setQueryData(authKeys.me, data.user);
      navigate(getDefaultRouteForRole(data.user.role), { replace: true });
    },
  });
}

export function useRequestOtp() {
  return useMutation({
    mutationFn: (payload: RequestOtpPayload) => authApi.requestOtp(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
  });
}

export function useCompleteSignup() {
  const setUser = useAuthStore((s) => s.setUser);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompleteSignupPayload) =>
      authApi.completeSignup(payload),
    onSuccess: (data) => {
      setSessionFlag();
      setUser(data.user);
      setBootstrapped(true);
      queryClient.setQueryData(authKeys.me, data.user);
      navigate(getDefaultRouteForRole(data.user.role), { replace: true });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    try {
      await authApi.logout();
    } finally {
      clearSessionFlag();
      clearSession();
      queryClient.removeQueries({ queryKey: authKeys.me });
      navigate("/login", { replace: true });
    }
  };
}

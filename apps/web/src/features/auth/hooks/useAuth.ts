import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type {
  LoginPayload,
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

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.me(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin(options?: {
  redirectTo?: string | null;
  rememberSession?: boolean;
}) {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setSession(data, options?.rememberSession);
      queryClient.setQueryData(authKeys.me, data.user);
      const target =
        options?.redirectTo ?? getDefaultRouteForRole(data.user.role);
      navigate(target, { replace: true });
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setSession(data);
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
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompleteSignupPayload) =>
      authApi.completeSignup(payload),
    onSuccess: (data) => {
      setSession(data);
      queryClient.setQueryData(authKeys.me, data.user);
      navigate(getDefaultRouteForRole(data.user.role), { replace: true });
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    clearSession();
    queryClient.removeQueries({ queryKey: authKeys.me });
    navigate("/login", { replace: true });
  };
}

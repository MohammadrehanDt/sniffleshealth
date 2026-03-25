import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UpdateProfilePayload,
  UpsertAddressPayload,
} from "@sniffles/types";
import { authKeys } from "@/features/auth/hooks/useAuth";
import { profileApi } from "../services/profile.api";

export const profileKeys = {
  addresses: ["users", "addresses"] as const,
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me, data);
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatarUrl: string) => profileApi.updateAvatar(avatarUrl),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me, data);
    },
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: profileKeys.addresses,
    queryFn: () => profileApi.getAddresses(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertAddressPayload) =>
      profileApi.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpsertAddressPayload;
    }) => profileApi.updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses });
    },
  });
}

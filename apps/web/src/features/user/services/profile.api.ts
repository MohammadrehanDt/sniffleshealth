import type {
  AuthUser,
  UpdateProfilePayload,
  ProfileAddress,
  UpsertAddressPayload,
} from "@sniffles/types";
import { api } from "@/lib/api";

export const profileApi = {
  updateProfile: (payload: UpdateProfilePayload) =>
    api.patch<AuthUser>("/users/profile", payload).then((r) => r.data),

  updateAvatar: (avatarUrl: string) =>
    api
      .patch<AuthUser>("/users/profile/avatar", { avatarUrl })
      .then((r) => r.data),

  getAddresses: () =>
    api.get<ProfileAddress[]>("/users/addresses").then((r) => r.data),

  createAddress: (payload: UpsertAddressPayload) =>
    api.post<ProfileAddress>("/users/addresses", payload).then((r) => r.data),

  updateAddress: (id: string, payload: UpsertAddressPayload) =>
    api
      .patch<ProfileAddress>(`/users/addresses/${id}`, payload)
      .then((r) => r.data),

  deleteAddress: (id: string) =>
    api.delete(`/users/addresses/${id}`).then((r) => r.data),
};

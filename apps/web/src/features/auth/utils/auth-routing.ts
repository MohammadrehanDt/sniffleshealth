import type { UserRole } from "@sniffles/types";
import { ROUTES } from "@/constants";

export function getDefaultRouteForRole(role: UserRole) {
  if (role === "DOCTOR") {
    return ROUTES.DOCTOR_DASHBOARD;
  }

  if (role === "ADMIN") {
    return ROUTES.ADMIN_DASHBOARD;
  }

  return ROUTES.DASHBOARD;
}

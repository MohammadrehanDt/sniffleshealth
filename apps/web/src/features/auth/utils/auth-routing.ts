import type { UserRole } from "@sniffles/types";
import { ROUTES } from "@/constants";

export function getDefaultRouteForRole(role: UserRole) {
  return role === "DOCTOR" ? ROUTES.DOCTOR_DASHBOARD : ROUTES.DASHBOARD;
}

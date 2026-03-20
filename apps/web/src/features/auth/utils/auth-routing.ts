import type { UserRole } from "@sniffles/types";
import { ROUTES } from "@/constants";

export function getDefaultRouteForRole(role: UserRole) {
  return role === "doctor" ? ROUTES.DOCTOR_DASHBOARD : ROUTES.DASHBOARD;
}

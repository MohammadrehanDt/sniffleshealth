import type { UserRole } from "@sniffles/types";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

import type { PropsWithChildren } from "react";
import type { UserRole } from "@sniffles/types";
import { AppSidebar } from "./AppSidebar";

type AppShellProps = PropsWithChildren<{
  role: UserRole;
}>;

export function AppShell({ role, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcfaf8_0%,#f8fafc_100%)] text-foreground lg:flex">
      <AppSidebar role={role} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

import type { UserRole } from "@sniffles/types";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout";
import { navigationByRole } from "./navigation";

type AppSidebarProps = {
  role: UserRole;
};

export function AppSidebar({ role }: AppSidebarProps) {
  const items = navigationByRole[role];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border/70 bg-[#f6f1eb] lg:flex lg:flex-col">
      <div className="border-b border-border/70 px-6 py-6">
        <Logo size="md" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {role === "DOCTOR" ? "Physician Workspace" : "Patient Workspace"}
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground",
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

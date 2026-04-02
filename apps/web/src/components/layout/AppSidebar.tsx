import { useAuthStore } from "@/stores/auth.store";
import { navigationByRole } from "@/components/app-shell/navigation";
import { useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./Logo";
import { NavLink } from "../NavLink";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const logout = useLogout();
  const role = useAuthStore((store) => store.user?.role ?? "PATIENT");
  const items = navigationByRole[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <Logo className="h-6 w-auto" />
        </div>
      </SidebarHeader>

      <Separator className="bg-sidebar-border" />

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.to}
                      tooltip={item.label}
                    >
                      <NavLink
                        to={item.to}
                        end
                        className="gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        activeClassName="bg-sidebar-primary/15 !text-[#1B7F88] font-medium"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <Separator className="bg-sidebar-border mb-2" />
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/40 text-center mt-2">
            © 2026 Sniffles Health
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

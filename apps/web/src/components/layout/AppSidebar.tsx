import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
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
import { NavLink } from "../NavLink";
import { Logo } from "./Logo";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

const sidebarConfig: SidebarSection[] = [
  {
    items: [
      { title: "Dashboard", url: "/dashboard", icon: "/images/sidebar/dashboard.png" },
      { title: "Consultations", url: "/consultations", icon: "/images/sidebar/consultations.png" },
      { title: "Appointments", url: "/appointments", icon: "/images/sidebar/appointments.png" },
      { title: "Medical Profile", url: "/medical-profile",  icon: "/images/sidebar/medical-profile.png" },
      { title: "Lab Results", url: "/lab-results", icon: "/images/sidebar/lab.png" },
      { title: "Medication Refill", url: "/medication-refill", icon: "/images/sidebar/medication-refill.png" },
      { title: "My Profile", url: "/profile", icon: "/images/sidebar/my-profile.png" },
      { title: "Billings", url: "/billings", icon: "/images/sidebar/billings.png" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
        <Logo className="h-6 w-auto" />
        </div>
      </SidebarHeader>

      <Separator className="bg-sidebar-border" />

      <SidebarContent className="px-2 py-2">
        {sidebarConfig.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <NavLink
                        to={item.url}
                        end
                        className="gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        activeClassName="bg-sidebar-primary/15 !text-[#1B7F88] font-medium"
                      >
                        {item.icon ? (
                          <img src={item.icon} alt={item.title} className="h-4 w-4 shrink-0" />
                        ) : item.fallbackIcon ? (
                          <item.fallbackIcon className="h-4 w-4 shrink-0" />
                        ) : null}
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <Separator className="bg-sidebar-border mb-2" />
        <button
          onClick={() => navigate("/login")}
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

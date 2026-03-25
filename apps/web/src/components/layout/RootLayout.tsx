import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getDisplayName, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { AppSidebar } from "./AppSidebar";

export function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const initials = getInitials(user?.fullName);
  const displayName = getDisplayName(user?.fullName, user?.email);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-end border-b bg-card px-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">
                  {displayName}
                </p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

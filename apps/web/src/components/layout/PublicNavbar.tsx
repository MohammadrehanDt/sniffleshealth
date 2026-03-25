import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/constants";
import { getDefaultRouteForRole } from "@/features/auth/utils/auth-routing";
import { getDisplayName, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { Logo } from "./Logo";

export function PublicNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = getInitials(user?.fullName);
  const displayName = getDisplayName(user?.fullName, user?.email);
  const authenticatedTarget = user
    ? getDefaultRouteForRole(user.role)
    : ROUTES.LOGIN;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/95 shadow-sm backdrop-blur">
      <div className="app-shell flex h-16 items-center justify-between sm:h-20">
        <Logo size="lg" src="/images/logo1.png" />

        <div className="hidden items-center gap-4 sm:flex md:gap-6">
          {user ? (
            <button
              type="button"
              onClick={() => navigate(authenticatedTarget)}
              className="flex items-center gap-3 rounded-full border border-border bg-card px-2 py-1 pr-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span>{displayName}</span>
            </button>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-800"
            >
              Login
            </Link>
          )}
          <Button
            onClick={() =>
              navigate(user ? authenticatedTarget : ROUTES.SYMPTOMS)
            }
            className="h-11 rounded-xl bg-brand-700 px-6 text-sm font-medium text-[#E8F4F5] hover:bg-brand-800 md:h-12 md:px-8"
          >
            {user ? "Go to Dashboard" : "Start Consultation"}
          </Button>
        </div>

        <button
          type="button"
          className="p-2 sm:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-4 pt-2 sm:hidden">
          <div className="app-shell space-y-3 px-0">
            {user ? (
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-left text-sm font-medium text-foreground"
                onClick={() => {
                  navigate(authenticatedTarget);
                  setMobileOpen(false);
                }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span>{displayName}</span>
              </button>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="block py-2 text-sm font-medium text-brand-700"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
            <Button
              onClick={() => {
                navigate(user ? authenticatedTarget : ROUTES.SYMPTOMS);
                setMobileOpen(false);
              }}
              className="h-11 w-full rounded-xl bg-brand-700 text-sm font-medium text-[#E8F4F5] hover:bg-brand-800"
            >
              {user ? "Go to Dashboard" : "Start Consultation"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

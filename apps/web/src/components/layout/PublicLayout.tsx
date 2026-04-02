import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { LandingFooter } from "@/features/landing/components";
import { PublicNavbar } from "./PublicNavbar";

export function PublicLayout() {
  const location = useLocation();
  const isIntakePage = location.pathname === ROUTES.INTAKE;

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <PublicNavbar />
      <main className="pt-16 sm:pt-20">
        <Outlet />
      </main>
      {isIntakePage ? null : <LandingFooter />}
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { LandingFooter } from "@/features/landing/components";
import { PublicNavbar } from "./PublicNavbar";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <PublicNavbar />
      <main className="pt-16 sm:pt-20">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}

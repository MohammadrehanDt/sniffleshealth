import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export function LandingHeader() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
        <Logo size="lg" src="/images/logo1.png" />

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6 md:gap-8">
          <Link
            to={ROUTES.LOGIN}
            className="text-brand-700 font-medium text-sm hover:text-brand-800 transition-colors"
          >
            Login
          </Link>
          <Button
            onClick={() => navigate(ROUTES.SYMPTOMS)}
            className="bg-brand-700 hover:bg-brand-800 text-[#E8F4F5] font-medium text-sm rounded-xl px-6 md:px-8 h-11 md:h-12"
          >
            Start Consultation
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t bg-white px-4 pb-4 pt-2 space-y-3">
          <Link
            to={ROUTES.LOGIN}
            className="block text-brand-700 font-medium text-sm py-2"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
          <Button
            onClick={() => {
              navigate(ROUTES.SYMPTOMS);
              setMobileOpen(false);
            }}
            className="w-full bg-brand-700 hover:bg-brand-800 text-[#E8F4F5] font-medium text-sm rounded-xl h-11"
          >
            Start Consultation
          </Button>
        </div>
      )}
    </header>
  );
}

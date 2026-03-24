import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { FOOTER_LINKS } from "../constants/landing-data";

export function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0F5C63] text-white border-t border-white/10">
      <div className="app-shell py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-20 items-start">
          {/* Branding */}
          <div className="sm:col-span-2 space-y-6 md:space-y-8">
            <img
              src="/images/logowhite.png"
              alt="Sniffles Health"
              className="h-10 md:h-12 w-auto"
            />
            <p className="text-[#F2F6F7] text-sm leading-relaxed max-w-xs">
              Consultation in minutes, <br />
              AI powered healthcare for everyone
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-2 flex flex-col items-start lg:items-center">
            <ul className="space-y-3 md:space-y-4 text-[#F2F6F7] text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center lg:justify-end gap-4 sm:gap-8">
            <Link
              to={ROUTES.LOGIN}
              className="text-[#146D75] font-medium text-sm hover:text-white transition-all flex items-center gap-3 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Login
            </Link>
            <Button
              onClick={() => navigate(ROUTES.SYMPTOMS)}
              className="bg-[#146D75] hover:bg-brand-600 text-[#E8F4F5] rounded-2xl px-8 md:px-12 h-12 md:h-16  text-sm font-medium tracking-tight shadow-2xl shadow-black/20"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

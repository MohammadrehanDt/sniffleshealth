/**
 * Page Header component with back button, step indicator, and centered logo
 * Used across most pages for consistent navigation
 */

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { FONTS, ROUTES } from "@/constants";
import { Logo } from "./Logo";

interface PageHeaderProps {
  backTo?: string;
  step?: string;
  title?: string;
  showLogo?: boolean;
}

export function PageHeader({
  backTo,
  step,
  title,
  showLogo = true,
}: PageHeaderProps) {
  return (
    <div className="bg-neutral-off-white px-6 py-4">
      <div className="max-w-[1464px] mx-auto flex items-center justify-between relative">
        {/* Left Side - Back Button & Title */}
        {(backTo || step || title) && (
          <div className="flex items-center gap-3">
            {backTo && (
              <Link
                to={backTo}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-gray bg-neutral-off-white shadow-sm opacity-90 hover:opacity-100 transition-opacity"
              >
                <ArrowLeft className="w-6 h-6 text-text-primary" />
              </Link>
            )}
            {(step || title) && (
              <div className="flex flex-col">
                {step && (
                  <span className="text-text-secondary text-sm font-inter leading-5">
                    {step}
                  </span>
                )}
                {title && (
                  <span className="text-text-dark text-base font-inter font-medium leading-6">
                    {title}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Center - Logo */}
        {showLogo && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Logo />
          </div>
        )}

        {/* Right Side - Placeholder for symmetry */}
        {(backTo || step || title) && (
          <button className="flex items-center justify-center w-10 h-10 rounded-full border border-border-medium shadow-sm opacity-0 pointer-events-none">
            <ArrowLeft className="w-6 h-6 text-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}

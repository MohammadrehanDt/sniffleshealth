/**
 * Application Footer component
 * Used across pages for consistent footer with HIPAA badge
 */

import { Lock } from "lucide-react";
import { FONTS } from "@/constants";

export function AppFooter() {
  return (
    <div className="bg-neutral-off-white border-neutral-gray px-6 py-2">
      <div className="max-w-[1464px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 text-neutral-dark-gray font-inter font-semibold text-base hover:text-text-primary transition-colors">
            About Us
          </button>
          <button className="px-3 py-2 text-neutral-dark-gray font-inter font-semibold text-base hover:text-text-primary transition-colors">
            Privacy Policy
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 border border-neutral-dark-gray rounded-full">
          <Lock className="w-4 h-4 text-neutral-dark-gray" />
          <span className="text-neutral-dark-gray font-inter font-semibold text-base">
            HIPAA Compliant
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * SafetyStopBanner - Warning banner for safety stops
 * Reusable across chat components
 */

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface SafetyStopBannerProps {
  message: string;
}

export function SafetyStopBanner({ message }: SafetyStopBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="p-6 bg-warm-50 border-l-4 border-l-warm-400 relative">
      <div className="flex items-start gap-3 max-w-[672px] mx-auto">
        <AlertTriangle className="w-5 h-5 text-warm-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-warm-800 font-inter font-semibold text-sm mb-1">
            Important Notice
          </h3>
          <p className="text-neutral-dark-gray text-sm font-inter">{message}</p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 p-1 hover:bg-warm-300/50 rounded-lg transition-colors"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4 text-warm-600" />
        </button>
      </div>
    </div>
  );
}

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FONTS } from "@/constants";

export interface ErrorDisplayProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "inline" | "banner";
}

/**
 * ErrorDisplay - Reusable component for displaying error messages
 */
export function ErrorDisplay({
  message,
  title = "Error",
  onRetry,
  className,
  variant = "default",
}: ErrorDisplayProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-start gap-2 text-destructive", className)}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-inter">
          {message}
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "bg-semantic-error-light border border-destructive/30 rounded-lg p-4 flex items-start gap-3",
          className,
        )}
      >
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-semantic-error font-inter font-semibold text-sm mb-1">
            {title}
          </h3>
          <p className="text-semantic-error text-sm font-inter">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-destructive text-sm font-inter font-medium hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        className,
      )}
    >
      <AlertCircle className="w-12 h-12 text-destructive" />
      <div>
        <h3 className="text-text-dark font-inter font-semibold text-lg mb-2">
          {title}
        </h3>
        <p className="text-text-light text-sm font-inter">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-brand-cyan text-white font-inter rounded-lg hover:bg-brand-cyan/90 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  labelAction?: ReactNode;
}

/**
 * FormField - Standardized form input wrapper component
 * Provides consistent styling and error handling for form fields
 */
export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
  labelClassName,
  labelAction,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between gap-3">
          <Label
            className={cn(
              "text-[#2F4246] text-sm font-inter font-medium",
              required &&
                "after:content-['*'] after:ml-1 after:text-destructive",
              labelClassName,
            )}
          >
            {label}
          </Label>
          {labelAction}
        </div>
      )}
      {children}
      {hint && !error && (
        <p className="text-text-light text-xs font-inter">{hint}</p>
      )}
      {error && <p className="text-destructive text-xs font-inter">{error}</p>}
    </div>
  );
}

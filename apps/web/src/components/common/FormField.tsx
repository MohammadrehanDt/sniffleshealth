import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FONTS } from "@/constants";
import type { ReactNode } from "react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
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
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          className={cn(
            "text-text-dark text-sm font-inter font-medium",
            required && "after:content-['*'] after:ml-1 after:text-destructive",
            labelClassName,
          )}
        >
          {label}
        </Label>
      )}
      {children}
      {hint && !error && (
        <p className="text-text-light text-xs font-inter">{hint}</p>
      )}
      {error && <p className="text-destructive text-xs font-inter">{error}</p>}
    </div>
  );
}

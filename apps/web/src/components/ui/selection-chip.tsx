import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectionChipVariants = cva(
  "inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-center font-inter text-sm font-normal leading-[1.2] tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      tone: {
        default: "text-neutral-600 hover:border-neutral-500 hover:bg-muted/40",
        selected: "border-brand-600 bg-brand-100 text-brand-600",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export interface SelectionChipProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof selectionChipVariants> {}

const SelectionChip = React.forwardRef<HTMLButtonElement, SelectionChipProps>(
  ({ className, tone, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(selectionChipVariants({ tone }), className)}
        {...props}
      />
    );
  },
);

SelectionChip.displayName = "SelectionChip";

export { SelectionChip, selectionChipVariants };

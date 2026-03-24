import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  size = "md",
}: AppModalProps) {
  const sizeClasses = {
    sm: "sm:max-w-[400px]",
    md: "sm:max-w-[500px]",
    lg: "sm:max-w-[700px]",
    xl: "sm:max-w-[900px]",
    full: "sm:max-w-[95vw]",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex flex-col gap-0",
          "w-[95vw] max-h-[90vh] rounded-2xl p-0",
          sizeClasses[size],
          !showCloseButton && "[&>button]:hidden",
          className,
        )}
      >
        {/* HEADER - Remains sticky at the top */}
        <DialogHeader className="p-6 pb-4 text-left md:p-8 md:pb-4 shrink-0">
          {title ? (
            <DialogTitle className="text-xl font-bold text-neutral-900 md:text-2xl">
              {title}
            </DialogTitle>
          ) : (
            <VisuallyHidden>
              <DialogTitle>Dialog Modal</DialogTitle>
            </VisuallyHidden>
          )}
          {description && (
            <DialogDescription className="text-sm text-neutral-500 mt-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="overflow-y-auto p-6 pt-0 md:p-8 md:pt-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

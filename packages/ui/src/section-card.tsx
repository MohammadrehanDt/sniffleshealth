import type { HTMLAttributes } from "react";
import { cn } from "@sniffles/utils";

export function SectionCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}
      {...props}
    />
  );
}

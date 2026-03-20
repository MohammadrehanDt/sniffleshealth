import type { PropsWithChildren } from "react";
import { cn } from "@sniffles/utils";

type PageShellProps = PropsWithChildren<{
  className?: string;
}>;

export function PageShell({ className, children }: PageShellProps) {
  return (
    <div
      className={cn("min-h-screen bg-background text-foreground", className)}
    >
      {children}
    </div>
  );
}

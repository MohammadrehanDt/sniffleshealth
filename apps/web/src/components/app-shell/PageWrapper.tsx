import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type PageWrapperProps = PropsWithChildren<{
  className?: string;
}>;

export function PageWrapper({ className, children }: PageWrapperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 py-8", className)}>
      {children}
    </div>
  );
}

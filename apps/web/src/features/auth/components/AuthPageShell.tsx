import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkTo: string;
  footerLinkLabel: string;
  children: ReactNode;
  cardClassName?: string;
}

function BackgroundShape({ className }: { className: string }) {
  return (
    <img
      src="/images/Vector.png"
      alt=""
      aria-hidden="true"
      className={cn(
        "absolute z-0 w-[450px] select-none object-contain opacity-40 pointer-events-none 2xl:w-[550px]",
        className,
      )}
    />
  );
}

export function AuthPageShell({
  title,
  subtitle,
  footerText,
  footerLinkTo,
  footerLinkLabel,
  children,
  cardClassName,
}: AuthPageShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F3F7F8] p-4 font-inter">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundShape className="-top-[20%] -left-[5%]" />
        <BackgroundShape className="-top-[20%] left-[57.5%] -translate-x-1/2" />
        <BackgroundShape className="-top-[20%] -right-[20%]" />
        <BackgroundShape className="-bottom-[5%] -left-[5%]" />
        <BackgroundShape className="-bottom-[5%] left-[57.5%] -translate-x-1/2" />
        <BackgroundShape className="-bottom-[5%] -right-[20%]" />
      </div>

      <div
        className={cn(
          "relative z-10 flex w-full flex-col gap-6 rounded-xl bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]",
          cardClassName,
        )}
      >
        <div className="flex justify-center">
          <img
            src="/images/logo.svg"
            alt="SnifflesHealth"
            className="h-[33px] w-[96px] object-contain"
          />
        </div>

        <div className="space-y-1 text-center">
          <h1 className="text-[22px] font-medium text-[#1A1A1A]">{title}</h1>
          <p className="text-sm text-[#666666]">{subtitle}</p>
        </div>

        {children}

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px]">
          <span className="text-[#666666]">{footerText}</span>
          <Link
            to={footerLinkTo}
            className="font-medium text-[#3B82F6] hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

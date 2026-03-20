import React from "react";
import { AlertTriangle, Info, CheckCircle, XCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertType = "warning" | "info" | "success" | "error";

// Using standard Tailwind colors for exact immediate visual match
const alertConfig: Record<AlertType, { icon: LucideIcon; containerClass: string; iconClass: string }> = {
  warning: { 
    icon: AlertTriangle, 
    containerClass: "bg-orange-50 border-orange-100 text-slate-800",
    iconClass: "text-orange-400"
  },
  info: { 
    icon: Info, 
    containerClass: "bg-blue-50 border-blue-100 text-slate-800",
    iconClass: "text-blue-500"
  },
  success: { 
    icon: CheckCircle, 
    containerClass: "bg-green-50 border-green-100 text-slate-800",
    iconClass: "text-green-500"
  },
  error: { 
    icon: XCircle, 
    containerClass: "bg-red-50 border-red-100 text-slate-800",
    iconClass: "text-red-500"
  },
};

interface AlertBannerProps {
  type?: AlertType;
  title?: string;
  message: string | React.ReactNode;
  className?: string;
}

export function AlertBanner({ type = "warning", title, message, className }: AlertBannerProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3.5", config.containerClass, className)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClass)} />
      <div className="flex-1">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
}
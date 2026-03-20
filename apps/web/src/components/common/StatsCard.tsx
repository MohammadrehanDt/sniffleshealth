import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | string;
  footer?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  footer,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <Card className={cn("border rounded-xl shadow-sm bg-white overflow-hidden", className)}>
      <div className="p-6 flex flex-col gap-4">
        {/* 1. Icon Circle */}
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          iconClassName
        )}>
          {typeof icon === "string" ? (
            <img src={icon} alt={title} className="h-[16px] w-[16px]" />
          ) : (
            (() => { const Icon = icon; return <Icon className="h-[16px] w-[16px]" />; })()
          )}
        </div>

        {/* 2. Content */}
        <div className="space-y-1">
          <p className="text-neutral-600 text-sm font-normal leading-tight">
            {title}
          </p>
          <p className="text-[20px] font-medium text-neutral-800">
            {value}
          </p>
        </div>

        {/* 3. Footer (Action Link) */}
        {footer && (
          <div>
            {footer}
          </div>
        )}
      </div>
    </Card>
  );
}
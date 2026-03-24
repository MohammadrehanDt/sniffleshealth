import React from "react";
import { cn } from "@/lib/utils";

interface ListItem {
  id: string | number;
  content: React.ReactNode;
  prefix?: React.ReactNode;
}

interface ListGroupProps {
  items: ListItem[];
  variant?: "bullet" | "number" | "none";
  className?: string;
  itemClassName?: string;
}

export function ListGroup({
  items,
  variant = "bullet",
  className,
  itemClassName,
}: ListGroupProps) {
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((item, index) => (
        <li
          key={item.id}
          className={cn(
            "flex items-start gap-2 text-sm text-slate-600",
            itemClassName,
          )}
        >
          {/* Prefix Logic */}
          <span className="shrink-0 mt-1.5 flex items-center justify-center">
            {item.prefix ? (
              item.prefix
            ) : variant === "bullet" ? (
              <div className="h-1 w-1 rounded-full bg-slate-400" />
            ) : variant === "number" ? (
              <span className="text-xs font-medium text-slate-500">
                {index + 1}.
              </span>
            ) : null}
          </span>

          {/* Content */}
          <div className="flex-1">{item.content}</div>
        </li>
      ))}
    </ul>
  );
}

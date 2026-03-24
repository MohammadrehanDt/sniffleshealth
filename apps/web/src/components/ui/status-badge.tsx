import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "destructive" | "info" | "muted";

interface StatusConfig {
  variant: StatusVariant;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  Completed: { variant: "success" },
  Active: { variant: "success" },
  Normal: { variant: "success" },
  Paid: { variant: "success" },
  Confirmed: { variant: "success" },
  "In Progress": { variant: "info" },
  Scheduled: { variant: "info" },
  Pending: { variant: "warning" },
  Awaiting: { variant: "warning" },
  Paused: { variant: "warning" },
  Overdue: { variant: "destructive" },
  Cancelled: { variant: "destructive" },
  Abnormal: { variant: "destructive" },
};

const variantClasses: Record<StatusVariant, string> = {
  success: "bg-success/15 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/20",
  destructive: "bg-destructive/15 text-destructive border-destructive/20",
  info: "bg-info/15 text-info border-info/20",
  muted: "bg-muted text-muted-foreground border-border",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { variant: "muted" as StatusVariant };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClasses[config.variant],
        className,
      )}
    >
      {status}
    </span>
  );
}

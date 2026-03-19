import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  attention: "border-rose-200 bg-rose-50 text-rose-700",
  completed: "border-slate-200 bg-slate-100 text-slate-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  scheduled: "border-cyan-200 bg-cyan-50 text-cyan-700",
} as const;

type StatusTone = keyof typeof statusStyles;

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
  className?: string;
};

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusStyles[tone], className)}
    >
      {label}
    </Badge>
  );
}

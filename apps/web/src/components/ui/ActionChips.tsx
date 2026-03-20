import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ActionItem {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isActive?: boolean;
}

interface ActionChipsProps {
  title?: string;
  actions: ActionItem[];
  containerClassName?: string;
  chipClassName?: string;
}

const variantMap = {
  primary: "brand",
  secondary: "brand-soft",
  outline: "brand-outline",
} as const;

export const ActionChips = ({
  title,
  actions,
  containerClassName,
  chipClassName,
}: ActionChipsProps) => {
  return (
    <div className={cn("w-full border rounded-xl p-4 bg-white", containerClassName)}>
      {title && (
        <h3 className="text-neutral-800 font-bold text-sm mb-4 px-1 tracking-tight">
          {title}
        </h3>
      )}

      <div className="flex flex-wrap gap-3">
        {actions.map((action, index) => {
          const actionVariant = action.variant ?? (index === 0 ? "primary" : "secondary");

          return (
            <Button
              key={action.label}
              onClick={action.onClick}
              variant={variantMap[actionVariant]}
              className={cn(
                "rounded-lg px-5 py-2.5",
                chipClassName,
                action.isActive && "ring-2 ring-offset-2 ring-brand-600"
              )}
            >
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
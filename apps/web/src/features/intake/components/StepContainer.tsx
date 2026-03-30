import type { ReactNode } from "react";
import { SelectionChip } from "@/components/ui/selection-chip";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type StepContainerProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

type StepFieldProps = {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
};

type StepChipButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  selectedClassName?: string;
  unselectedClassName?: string;
};

type StepChipGroupProps = {
  options: string[];
  selectedValue?: string;
  selectedValues?: string[];
  onSelect?: (value: string) => void;
  onToggle?: (value: string) => void;
  className?: string;
  chipClassName?: string;
  selectedChipClassName?: string;
  unselectedChipClassName?: string;
};

type ReviewItem = {
  label: string;
  value: string;
};

export function StepContainer({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
}: StepContainerProps) {
  return (
    <div
      className={cn(
        "space-y-6 animate-in fade-in slide-in-from-right-4",
        className,
      )}
    >
      <div className="space-y-1">
        <h2
          className={cn(
            "text-[20px] font-semibold text-neutral-800",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className={cn("text-sm text-neutral-600", descriptionClassName)}>
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </div>
  );
}

export function StepField({
  label,
  htmlFor,
  error,
  children,
  className,
  labelClassName,
}: StepFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <Label
          htmlFor={htmlFor}
          className={cn(
            "font-inter text-sm font-normal leading-[1.2] text-neutral-800",
            labelClassName,
          )}
        >
          {label}
        </Label>
      ) : null}
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function StepChipButton({
  label,
  selected,
  onClick,
  className,
  selectedClassName,
  unselectedClassName,
}: StepChipButtonProps) {
  return (
    <SelectionChip
      onClick={onClick}
      tone={selected ? "selected" : "default"}
      className={cn(
        className,
        selected ? selectedClassName : unselectedClassName,
      )}
    >
      {label}
    </SelectionChip>
  );
}

export function StepChipGroup({
  options,
  selectedValue,
  selectedValues,
  onSelect,
  onToggle,
  className,
  chipClassName,
  selectedChipClassName,
  unselectedChipClassName,
}: StepChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {options.map((option) => {
        const selected = selectedValues
          ? selectedValues.includes(option)
          : selectedValue === option;

        return (
          <StepChipButton
            key={option}
            label={option}
            selected={selected}
            onClick={() => {
              if (selectedValues) {
                onToggle?.(option);
                return;
              }

              onSelect?.(option);
            }}
            className={chipClassName}
            selectedClassName={selectedChipClassName}
            unselectedClassName={unselectedChipClassName}
          />
        );
      })}
    </div>
  );
}

export function StepReviewList({ items }: { items: ReviewItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between gap-6 text-sm">
          <span className="text-neutral-800">{item.label}</span>
          <span className="max-w-[200px] text-right text-neutral-600">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

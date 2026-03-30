import { useMemo, useState } from "react";
import { format, isValid, parse, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

function parseDateValue(value?: string) {
  if (!value) {
    return undefined;
  }

  const isoDate = parseISO(value);
  if (isValid(isoDate)) {
    return isoDate;
  }

  const displayDate = parse(value, "MM/dd/yyyy", new Date());
  if (isValid(displayDate)) {
    return displayDate;
  }

  return undefined;
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className,
  minDate,
  maxDate,
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = useMemo(() => parseDateValue(value), [value]);

  function handleSelect(date: Date | undefined) {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-12 w-full justify-start rounded-xl border-neutral-200 px-3 text-left font-normal hover:bg-transparent focus-visible:ring-brand-500",
            !selectedDate && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex-1 truncate">
            {selectedDate ? format(selectedDate, "MM/dd/yyyy") : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-neutral-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

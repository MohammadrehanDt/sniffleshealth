import {
  forwardRef,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  containerProps?: HTMLAttributes<HTMLDivElement>;
  iconProps?: HTMLAttributes<HTMLSpanElement>;
  onValueChange?: (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      containerClassName,
      inputClassName,
      iconClassName,
      icon,
      iconPosition = "end",
      containerProps,
      iconProps,
      onChange,
      onValueChange,
      placeholder = "Search...",
      ...props
    },
    ref,
  ) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value, event);
    };

    const searchIcon = (
      <span
        {...iconProps}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center text-[#146D75] opacity-70 transition-opacity hover:opacity-100",
          iconClassName,
          iconProps?.className,
        )}
      >
        {icon ?? <Search className="h-5 w-5" />}
      </span>
    );

    return (
      <div
        {...containerProps}
        className={cn(
          "flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm",
          containerClassName,
          containerProps?.className,
        )}
      >
        {iconPosition === "start" ? searchIcon : null}
        <input
          {...props}
          ref={ref}
          type={props.type ?? "text"}
          placeholder={placeholder}
          onChange={handleChange}
          className={cn(
            "w-full border-none bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-300 sm:text-base",
            inputClassName,
          )}
        />
        {iconPosition === "end" ? searchIcon : null}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

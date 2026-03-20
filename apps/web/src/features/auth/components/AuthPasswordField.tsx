import { useState, type ComponentProps, type ReactNode, type Ref } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/common/FormField";
import { Input } from "@/components/ui/input";

type InputProps = Omit<ComponentProps<typeof Input>, "type">;

interface AuthPasswordFieldProps extends InputProps {
  label: string;
  error?: string;
  action?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
}

const fieldLabelClassName = "mb-1.5 text-[13px] font-normal text-[#4D4D4D]";
const inputClassName =
  "h-[42px] rounded-lg border-[#E5E7EB] pr-11 text-sm placeholder:text-[#A3A3A3] focus:border-[#1B6E75] focus-visible:ring-0";

function getNormalizedError(label: string, error?: string) {
  if (!error) {
    return undefined;
  }

  if (error === "Required" || error === "required") {
    return `${label} is required`;
  }

  return error;
}

export function AuthPasswordField({
  label,
  error,
  action,
  inputRef,
  className,
  ...inputProps
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const normalizedError = getNormalizedError(label, error);

  return (
    <FormField
      label={label}
      error={normalizedError}
      labelClassName={fieldLabelClassName}
      labelAction={action}
    >
      <div className="relative w-full">
        <Input
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          className={cn(
            inputClassName,
            normalizedError && "border-semantic-error",
            className,
          )}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3A3A3] transition-colors hover:text-[#4D4D4D]"
        >
          {showPassword ? (
            <EyeOff size={16} strokeWidth={2.5} />
          ) : (
            <Eye size={16} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </FormField>
  );
}

import { ReactNode, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export type SelectDropdownOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type SelectDropdownProps<T extends string = string> = {
  label: string;
  value: T;
  options: SelectDropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function SelectDropdown<T extends string = string>({
  label,
  value,
  options,
  onChange,
  className = "",
}: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => setIsOpen(false), isOpen);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4
  sm:p-5 flex items-center justify-between transition-all hover:border-gray-200"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-gray-400 font-medium text-sm">{label}</span>

          {selectedOption && (
            <>
              {selectedOption.icon}
              <span className="text-gray-800 font-bold text-sm truncate">
                {selectedOption.label}
              </span>
            </>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#146D75] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-[110%] left-0 w-full bg-white rounded-xl
  shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in
  duration-200"
        >
          <div className="max-h-72 overflow-y-auto overscroll-contain">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left
  transition-colors ${isSelected ? "bg-[#F0F7F8]" : "hover:bg-[#F0F7F8]"}`}
                >
                  {option.icon}
                  <span className="text-gray-700 text-sm font-medium">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

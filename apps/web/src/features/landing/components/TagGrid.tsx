import { cn } from "@/lib/utils";

interface TagGridProps {
  title: string;
  subtitle: string;
  items: string[];
  variant?: "default" | "danger";
}

export function TagGrid({
  title,
  subtitle,
  items,
  variant = "default",
}: TagGridProps) {
  return (
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-[#2F4246] text-2xl md:text-[32px] font-semibold mb-2">
        {title}
      </h2>
      <p className="text-[#2F4246] font-medium text-sm md:text-base mb-8">
        {subtitle}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {items.map((item) => (
          <div
            key={item}
            className={cn(
              "py-4 md:py-5 rounded-lg text-[#2F4246] text-sm font-medium border border-transparent transition-all cursor-default",
              variant === "danger"
                ? "bg-[#E2555533]/20 hover:border-red-100"
                : "bg-[#F5F8F9] hover:border-gray-200",
            )}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

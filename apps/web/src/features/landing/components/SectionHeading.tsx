import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 md:mb-12", centered && "text-center")}>
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-inter-display font-semibold tracking-tight mb-4 leading-tight",
          light ? "text-white" : "text-neutral-800",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-sm md:text-base font-medium max-w-lg text-[#1B2B2E]",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

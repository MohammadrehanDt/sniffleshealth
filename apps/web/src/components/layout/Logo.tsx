/**
 * Logo component - Sniffles Health branding
 * Used across all pages for consistent branding
 */

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { width: "80", height: "28" },
    md: { width: "96", height: "33" },
    lg: { width: "120", height: "41" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/images/logo.svg"
        alt="Sniffles Health"
        width={currentSize.width}
        height={currentSize.height}
        className="h-auto"
      />
    </div>
  );
}


/**
 * DataField - Reusable component for displaying label-value pairs
 * Used in medical profiles, doctor chat sidebar, and other data displays
 */

interface DataFieldProps {
  label: string;
  value: string;
  className?: string;
}

export function DataField({ label, value, className = "" }: DataFieldProps) {
  return (
    <div className={`col-span-1 ${className}`}>
      <span className="text-text-secondary text-sm font-inter block mb-1">
        {label}
      </span>
      <div className="bg-warm-50 rounded-lg px-2 py-1">
        <span className="text-text-primary text-base font-inter">{value}</span>
      </div>
    </div>
  );
}

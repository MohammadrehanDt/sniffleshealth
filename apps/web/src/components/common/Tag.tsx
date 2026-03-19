/**
 * Tag - Reusable tag/badge component
 * Used for displaying symptoms, allergies, conditions, and other tags
 */

import { X } from "lucide-react";

interface TagProps {
  text: string;
  onRemove?: () => void;
  showRemove?: boolean;
  className?: string;
}

export function Tag({
  text,
  onRemove,
  showRemove = false,
  className = "",
}: TagProps) {
  return (
    <div
      className={`flex items-center justify-between gap-1 bg-neutral-light-gray rounded-lg px-3 py-1 ${className}`}
    >
      <span className="text-text-slate text-sm font-inter">{text}</span>
      {showRemove && onRemove && (
        <X
          className="w-4 h-4 text-text-secondary cursor-pointer hover:text-text-primary"
          onClick={onRemove}
        />
      )}
    </div>
  );
}

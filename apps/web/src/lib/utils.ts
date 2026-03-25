export { cn } from "@sniffles/utils";

/**
 * Format an ISO date string (e.g. "2026-03-12") to "Mar 12, 2026".
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string | null | undefined): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts?.length) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function getDisplayName(
  fullName: string | null | undefined,
  fallbackEmail?: string | null,
): string {
  return fullName?.trim() || fallbackEmail?.trim() || "User";
}

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

/**
 * Font family constants
 * Extracted from inline styles throughout the application
 */

export const FONTS = {
  inter: "Inter, -apple-system, sans-serif",
  interDisplay: "Inter Display, -apple-system, sans-serif",
  quincy: "Quincy CF, -apple-system, sans-serif",
} as const;

export type FontFamily = (typeof FONTS)[keyof typeof FONTS];

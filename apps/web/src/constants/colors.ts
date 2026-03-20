/**
 * SnifflesHealth Design System - Color Tokens
 *
 * These mirror the CSS custom properties in global.css.
 * Use Tailwind classes (e.g. bg-brand-500, text-neutral-800) whenever possible.
 * Import these constants only when you need hex values in JS (charts, canvas, etc.).
 */

export const COLORS = {
  // Primary brand palette
  primary: {
    700: "#0F5C63",
    600: "#146D75",
    500: "#1B7F88",
    400: "#3C9AA3",
    300: "#77BCC2",
    200: "#B8DADD",
    100: "#E8F4F5",
  },

  // Neutrals
  neutral: {
    800: "#2F4246",
    600: "#6A7E84",
    500: "#8FA1A6",
    300: "#D7E1E4",
    200: "#E7EEF0",
    black: "#000000",
  },

  // Semantic colors
  semantic: {
    success: "#2E9E6F",
    warning: "#F2A93B",
    error: "#E25555",
    info: "#3B82F6",
  },

  // Background colors
  background: {
    default: "#F5F8F9",
    card: "#FFFFFF",
    soft: "#EAF2F4",
    section: "#DCE8EB",
  },

  // Border
  border: {
    DEFAULT: "#D7E1E4",
    light: "#E7EEF0",
    dark: "#8FA1A6",
  },
} as const;

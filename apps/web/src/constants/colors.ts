/**
 * Design system color constants
 * Extracted from inline styles throughout the application
 */

export const COLORS = {
  // Primary brand colors
  primary: {
    cyan: "#0891B2",
    darkCyan: "#164E63",
    darkerCyan: "#045866",
    messageCyan: "#3e5e6a", // User message bubble color
    lightCyan: "#DCE9EB",
    lighterCyan: "#ECF3F4",
    lightestCyan: "#D9F2F7",
    paleCyan: "#C9E7EC",
    paleBlue: "#B5E3EA",
  },

  // Neutral colors
  neutral: {
    white: "#FFFFFF",
    offWhite: "#FCFAF8",
    lightGray: "#F3F4F6",
    gray: "#D6D3D1",
    darkGray: "#78716C",
    darkerGray: "#4B5563",
    darkestGray: "#1C1917",
    black: "#111827",
    charcoal: "#1F2937",
    slate: "#292524",
    stone: "#57534E",
  },

  // Semantic colors
  semantic: {
    success: "#00C950",
    green: "#34D399",
    error: "#7F1D1D",
    errorLight: "#FCE5E5",
    errorMedium: "#AD6767",
  },

  // Text colors
  text: {
    primary: "#1C1917",
    secondary: "#4B5563",
    tertiary: "#78716C",
    light: "#6A7282",
    dark: "#111827",
    charcoal: "#1F2937",
    slate: "#364153",
  },

  // Background colors
  background: {
    default: "#FCFAF8",
    light: "#F3F4F6",
    white: "#FFFFFF",
    offWhite: "#FCFAF8",
    dark: "#192D31",
    darker: "#134E4A",
  },

  // Border colors
  border: {
    light: "#D6D3D1",
    medium: "#D1D5DB",
    dark: "#E5E7EB",
  },
} as const;

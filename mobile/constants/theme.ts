/**
 * Theme Configuration
 * Centralized theme colors, fonts, and spacing
 */

export const theme = {
  colors: {
    light: {
      background: "#ffffff",
      backgroundSecondary: "#f5f5f5",
      text: "#000000",
      textSecondary: "#6b7280",
      primary: "#a855f7",
      border: "#e5e7eb",
      card: "#ffffff",
      modalOverlay: "rgba(0, 0, 0, 0.5)",
    },
    dark: {
      background: "#0f0f1a",
      backgroundSecondary: "#1f1f2e",
      text: "#ffffff",
      textSecondary: "#9ca3af",
      primary: "#a855f7",
      border: "#374151",
      card: "#1f1f2e",
      modalOverlay: "rgba(0, 0, 0, 0.7)",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

export type Theme = typeof theme;
export type ColorScheme = "light" | "dark";

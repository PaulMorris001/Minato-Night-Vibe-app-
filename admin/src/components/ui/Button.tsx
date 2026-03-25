import React from "react";
import { colors } from "../../constants/colors";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantBase: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: colors.primary, color: "#fff", border: "none" },
  secondary: { background: "transparent", color: colors.text, border: `1px solid ${colors.border}` },
  danger: { background: colors.errorDim, color: colors.error, border: `1px solid ${colors.error}` },
  ghost: { background: "transparent", color: colors.textMuted, border: "none" },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "4px 10px", fontSize: 12, borderRadius: 6 },
  md: { padding: "8px 16px", fontSize: 14, borderRadius: 8 },
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "opacity 0.15s",
        whiteSpace: "nowrap",
        ...variantBase[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {loading ? "..." : children}
    </button>
  );
}

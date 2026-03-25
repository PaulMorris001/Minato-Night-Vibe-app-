import React from "react";
import { colors } from "../../constants/colors";

type BadgeVariant = "success" | "error" | "warning" | "info" | "primary" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: { background: colors.successDim, color: colors.success, border: `1px solid ${colors.success}` },
  error: { background: colors.errorDim, color: colors.error, border: `1px solid ${colors.error}` },
  warning: { background: colors.warningDim, color: colors.warning, border: `1px solid ${colors.warning}` },
  info: { background: colors.infoDim, color: colors.info, border: `1px solid ${colors.info}` },
  primary: { background: colors.primaryDim, color: colors.primary, border: `1px solid ${colors.primary}` },
  default: { background: "rgba(255,255,255,0.08)", color: colors.textMuted, border: `1px solid ${colors.border}` },
};

export default function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        whiteSpace: "nowrap",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}

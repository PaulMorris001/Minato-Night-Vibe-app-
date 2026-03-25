import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../constants/colors";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Users",
  "/vendors": "Vendors",
  "/events": "Events",
  "/guides": "Guides",
};

export default function Header() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <button style={styles.logoutBtn} onClick={logout}>
        Sign out
      </button>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: 60,
    background: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.text,
  },
  logoutBtn: {
    background: "none",
    border: `1px solid ${colors.border}`,
    color: colors.textMuted,
    padding: "6px 14px",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
  },
};

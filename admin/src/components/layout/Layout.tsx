import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { colors } from "../../constants/colors";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.main}>
        <Header />
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: colors.bg,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  content: {
    flex: 1,
    padding: 24,
    overflow: "auto",
  },
};

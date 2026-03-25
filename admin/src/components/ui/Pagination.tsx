import React from "react";
import Button from "./Button";
import { colors } from "../../constants/colors";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div style={styles.container}>
      <span style={styles.info}>
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div style={styles.buttons}>
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ← Prev
        </Button>
        <span style={styles.pageNum}>{page} / {totalPages}</span>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next →
        </Button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderTop: `1px solid ${colors.border}`,
  },
  info: { fontSize: 13, color: colors.textMuted },
  buttons: { display: "flex", alignItems: "center", gap: 8 },
  pageNum: { fontSize: 13, color: colors.textMuted, minWidth: 60, textAlign: "center" },
};

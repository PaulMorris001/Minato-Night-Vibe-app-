import React, { useEffect, useState, useCallback } from "react";
import { adminApi } from "../api/admin";
import type { AdminGuide } from "../types";
import Table, { Column } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import SearchInput from "../components/ui/SearchInput";
import Pagination from "../components/ui/Pagination";
import PageShell from "../components/ui/PageShell";
import { ConfirmModal } from "../components/ui/Modal";
import { colors } from "../constants/colors";

const LIMIT = 20;

export default function Guides() {
  const [guides, setGuides] = useState<AdminGuide[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getGuides({ search, page, limit: LIMIT });
      setGuides(res.data.guides);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    try {
      await adminApi.deleteGuide(confirmId);
      setConfirmId(null);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: string) => {
    await adminApi.toggleGuideActive(id);
    load();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const columns: Column<AdminGuide>[] = [
    {
      key: "title",
      header: "Guide",
      render: (g) => (
        <div>
          <div style={{ fontWeight: 600 }}>{g.title}</div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>{g.topic} · {g.city}</div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      width: 130,
      render: (g) => (
        <span style={{ color: colors.textMuted }}>{g.author?.username ?? g.authorName ?? "—"}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      width: 80,
      render: (g) => (
        <span style={{ color: g.price > 0 ? colors.warning : colors.success }}>
          {g.price > 0 ? `$${g.price}` : "Free"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: 160,
      render: (g) => (
        <div style={{ display: "flex", gap: 4 }}>
          <Badge variant={g.isActive ? "success" : "error"}>{g.isActive ? "Active" : "Inactive"}</Badge>
          {g.isDraft && <Badge variant="warning">Draft</Badge>}
        </div>
      ),
    },
    {
      key: "date",
      header: "Created",
      width: 110,
      render: (g) => <span style={{ color: colors.textMuted }}>{formatDate(g.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      width: 160,
      render: (g) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => handleToggle(g._id)}>
            {g.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmId(g._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageShell
        toolbar={
          <SearchInput value={search} onSearch={handleSearch} placeholder="Search guides..." />
        }
      >
        <Table columns={columns} data={guides} keyExtractor={(g) => g._id} loading={loading} emptyMessage="No guides found" />
        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </PageShell>

      <ConfirmModal
        open={!!confirmId}
        title="Delete Guide"
        message="Are you sure you want to permanently delete this guide?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={!!deletingId}
      />
    </>
  );
}

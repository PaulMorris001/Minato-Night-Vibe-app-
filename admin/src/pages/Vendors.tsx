import React, { useEffect, useState, useCallback } from "react";
import { adminApi } from "../api/admin";
import type { AdminUser } from "../types";
import Table, { Column } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import SearchInput from "../components/ui/SearchInput";
import Pagination from "../components/ui/Pagination";
import PageShell from "../components/ui/PageShell";
import { ConfirmModal } from "../components/ui/Modal";
import { colors } from "../constants/colors";

const LIMIT = 20;

export default function Vendors() {
  const [vendors, setVendors] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Reuse the users endpoint but filter by vendor role client-side via search
      const res = await adminApi.getUsers({ search, page, limit: LIMIT });
      const vendorList = res.data.users.filter((u) => u.isVendor);
      setVendors(vendorList);
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
      await adminApi.deleteUser(confirmId);
      setConfirmId(null);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const handleVerify = async (id: string) => {
    await adminApi.toggleVendorVerified(id);
    load();
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "business",
      header: "Business",
      render: (u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {u.profilePicture ? (
            <img src={u.profilePicture} style={avatarStyle} alt="" />
          ) : (
            <div style={avatarPlaceholderStyle}>{(u.businessName ?? u.username)[0].toUpperCase()}</div>
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{u.businessName || u.username}</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "City",
      width: 120,
      render: (u) => <span style={{ color: colors.textMuted }}>{u.location?.city || "—"}</span>,
    },
    {
      key: "type",
      header: "Type",
      width: 140,
      render: (u) => u.vendorType ? <Badge variant="primary">{u.vendorType}</Badge> : <span style={{ color: colors.textDim }}>—</span>,
    },
    {
      key: "verified",
      header: "Verified",
      width: 100,
      render: (u) => (
        <Badge variant={u.verified ? "success" : "default"}>
          {u.verified ? "✓ Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: 160,
      render: (u) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => handleVerify(u._id)}>
            {u.verified ? "Unverify" : "Verify"}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmId(u._id)}>
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
          <SearchInput value={search} onSearch={handleSearch} placeholder="Search vendors..." />
        }
      >
        <Table columns={columns} data={vendors} keyExtractor={(u) => u._id} loading={loading} emptyMessage="No vendors found" />
        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </PageShell>

      <ConfirmModal
        open={!!confirmId}
        title="Delete Vendor"
        message="Are you sure you want to permanently delete this vendor? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={!!deletingId}
      />
    </>
  );
}

const avatarStyle: React.CSSProperties = { width: 32, height: 32, borderRadius: "50%", objectFit: "cover" };
const avatarPlaceholderStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: "50%",
  background: colors.primaryDim, color: colors.primary,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 13, fontWeight: 700,
};

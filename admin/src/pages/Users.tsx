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

const LIMIT = 10;

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ search, page, limit: LIMIT });
      setUsers(res.data.users);
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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {u.profilePicture ? (
            <img src={u.profilePicture} style={avatarStyle} alt="" />
          ) : (
            <div style={avatarPlaceholderStyle}>{u.username[0].toUpperCase()}</div>
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{u.username}</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: 100,
      render: (u) => (
        <Badge variant={u.isVendor ? "primary" : "default"}>
          {u.isVendor ? "Vendor" : "Client"}
        </Badge>
      ),
    },
    {
      key: "verified",
      header: "Verified",
      width: 90,
      render: (u) =>
        u.isVendor ? (
          <Badge variant={u.verified ? "success" : "default"}>
            {u.verified ? "✓ Yes" : "No"}
          </Badge>
        ) : (
          <span style={{ color: colors.textDim }}>—</span>
        ),
    },
    {
      key: "joined",
      header: "Joined",
      width: 120,
      render: (u) => <span style={{ color: colors.textMuted }}>{formatDate(u.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      width: 160,
      render: (u) => (
        <div style={{ display: "flex", gap: 6 }}>
          {u.isVendor && (
            <Button variant="secondary" size="sm" onClick={() => handleVerify(u._id)}>
              {u.verified ? "Unverify" : "Verify"}
            </Button>
          )}
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
          <SearchInput value={search} onSearch={handleSearch} placeholder="Search users..." />
        }
      >
        <Table columns={columns} data={users} keyExtractor={(u) => u._id} loading={loading} />
        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </PageShell>

      <ConfirmModal
        open={!!confirmId}
        title="Delete User"
        message="Are you sure you want to permanently delete this user? This cannot be undone."
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

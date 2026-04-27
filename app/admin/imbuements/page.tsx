"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ImbuementDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import Link from "next/link";

export default function AdminImbuementsPage() {
  const [items, setItems] = useState<ImbuementDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ImbuementDTO | null>(null);

  useEffect(() => {
    api.imbuements.findAll().then(setItems);
  }, []);

  const handleDelete = async (id: number) => {
    await api.imbuements.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Imbuements</h1>
        <Link
          href="/admin/imbuements/new"
          className="font-display text-xs tracking-widest uppercase px-4 py-2 bg-gold-subtle border border-gold-bright text-gold-bright rounded-sm hover:bg-gold-dim hover:text-text-primary transition-all duration-150 no-underline"
        >
          + Add Imbuement
        </Link>
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          {
            label: "Description",
            render: (i) => (
              <span className="text-text-muted text-xs">
                {i.description ?? "—"}
              </span>
            ),
          },
          {
            label: "Icon",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.icon ?? "—"}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/imbuements/${i.id}/edit`}
        onDelete={(id) =>
          setDeleteTarget(items.find((i) => i.id === id) ?? null)
        }
      />
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoreOfMagicSummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import Link from "next/link";

export default function AdminLoresPage() {
  const [lores, setLores] = useState<LoreOfMagicSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] =
    useState<LoreOfMagicSummaryDTO | null>(null);

  useEffect(() => {
    api.lores.findAll().then(setLores);
  }, []);

  const handleDelete = async (id: number) => {
    await api.lores.delete(id);
    setLores((prev) => prev.filter((l) => l.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Lores of Magic</h1>
        <Link
          href="/admin/lores/new"
          className="font-display text-xs tracking-widest uppercase px-4 py-2 bg-gold-subtle border border-gold-bright text-gold-bright rounded-sm hover:bg-gold-dim hover:text-text-primary transition-all duration-150 no-underline"
        >
          + Add Lore
        </Link>
      </div>
      <AdminTable
        items={lores}
        columns={[
          { label: "Name", render: (l) => l.name },
          {
            label: "Slug",
            render: (l) => (
              <span className="text-text-muted font-mono text-xs">
                {l.slug}
              </span>
            ),
          },
        ]}
        editPath={(l) => `/admin/lores/${l.id}/edit`}
        onDelete={(id) =>
          setDeleteTarget(lores.find((l) => l.id === id) ?? null)
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

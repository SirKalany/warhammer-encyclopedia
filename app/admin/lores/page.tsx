"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoreOfMagicSummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminLoresPage() {
  const [items, setItems] = useState<LoreOfMagicSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] =
    useState<LoreOfMagicSummaryDTO | null>(null);

  useEffect(() => {
    api.lores.findAll().then(setItems);
  }, []);

  const handleDelete = async (id: number) => {
    await api.lores.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Lores of Magic</h1>
        <AddButton href="/admin/lores/new" label="Add Lore" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          {
            label: "Slug",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.slug}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/lores/${i.id}/edit`}
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

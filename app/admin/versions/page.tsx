"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { GameVersionDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminVersionsPage() {
  const [items, setItems] = useState<GameVersionDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<GameVersionDTO | null>(null);

  useEffect(() => {
    api.versions.findAll().then(setItems);
  }, []);

  const handleDelete = async (id: number) => {
    await api.versions.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Game Versions</h1>
        <AddButton href="/admin/versions/new" label="Add Version" />
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
          {
            label: "Icon",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.icon ?? "—"}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/versions/${i.id}/edit`}
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

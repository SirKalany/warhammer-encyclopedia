"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AbilitySummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";
import Badge from "@/components/common/Badge";

export default function AdminAbilitiesPage() {
  const [items, setItems] = useState<AbilitySummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AbilitySummaryDTO | null>(
    null,
  );

  useEffect(() => {
    api.abilities.findAll().then(setItems);
  }, []);

  const handleDelete = async (id: number) => {
    await api.abilities.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Abilities</h1>
        <AddButton href="/admin/abilities/new" label="Add Ability" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          {
            label: "Type",
            render: (i) => (
              <Badge label={i.type.replace(/_/g, " ")} variant="default" />
            ),
          },
          {
            label: "Slug",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.slug}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/abilities/${i.id}/edit`}
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

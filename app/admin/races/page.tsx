"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RaceSummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminRacesPage() {
  const [items, setItems] = useState<RaceSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<RaceSummaryDTO | null>(null);

  useEffect(() => {
    api.races.findAll().then(setItems);
  }, []);

  const handleDelete = async (id: number) => {
    await api.races.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Races</h1>
        <AddButton href="/admin/races/new" label="Add Race" />
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
        editPath={(i) => `/admin/races/${i.id}/edit`}
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

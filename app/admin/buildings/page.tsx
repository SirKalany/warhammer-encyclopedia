"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BuildingSummaryDTO, RaceSummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminBuildingsPage() {
  const [items, setItems] = useState<BuildingSummaryDTO[]>([]);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<BuildingSummaryDTO | null>(
    null,
  );

  useEffect(() => {
    Promise.all([api.buildings.findAll(), api.races.findAll()]).then(
      ([buildings, races]) => {
        setItems(buildings);
        setRaces(races);
      },
    );
  }, []);

  const handleDelete = async (id: number) => {
    await api.buildings.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const raceName = (id: number) => races.find((r) => r.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Buildings</h1>
        <AddButton href="/admin/buildings/new" label="Add Building" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Race", render: (i) => raceName(i.raceId) },
          { label: "Category", render: (i) => i.category.replace(/_/g, " ") },
          {
            label: "Slug",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.slug}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/buildings/${i.id}/edit`}
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

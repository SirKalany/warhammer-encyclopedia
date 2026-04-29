"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { UnitSummaryDTO, RaceSummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminUnitsPage() {
  const [items, setItems] = useState<UnitSummaryDTO[]>([]);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<UnitSummaryDTO | null>(null);

  useEffect(() => {
    Promise.all([api.units.findAll(), api.races.findAll()]).then(
      ([units, races]) => {
        setItems(units);
        setRaces(races);
      },
    );
  }, []);

  const handleDelete = async (id: number) => {
    await api.units.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const raceNames = (ids: number[]) =>
    ids.map((id) => races.find((r) => r.id === id)?.name ?? "?").join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Units</h1>
        <AddButton href="/admin/units/new" label="Add Unit" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Races", render: (i) => raceNames(i.raceIds) },
          {
            label: "Slug",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.slug}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/units/${i.id}/edit`}
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

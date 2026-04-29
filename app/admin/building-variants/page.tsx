"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BuildingVariantSummaryDTO,
  GameVersionDTO,
  RaceSummaryDTO,
} from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminBuildingVariantsPage() {
  const [items, setItems] = useState<BuildingVariantSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] =
    useState<BuildingVariantSummaryDTO | null>(null);

  useEffect(() => {
    Promise.all([api.versions.findAll(), api.races.findAll()]).then(
      ([versions, races]) => {
        setVersions(versions);
        setRaces(races);
        Promise.all(
          versions.map((v) => api.buildingVariants.findByVersion(v.id)),
        ).then((results) => setItems(results.flat()));
      },
    );
  }, []);

  const handleDelete = async (id: number) => {
    await api.buildingVariants.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const versionName = (id: number) =>
    versions.find((v) => v.id === id)?.name ?? "—";
  const raceName = (id: number) => races.find((r) => r.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Building Variants</h1>
        <AddButton href="/admin/building-variants/new" label="Add Variant" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Race", render: (i) => raceName(i.raceId) },
          { label: "Version", render: (i) => versionName(i.gameVersionId) },
          { label: "Tier", render: (i) => (i.tier ? `Tier ${i.tier}` : "—") },
        ]}
        editPath={(i) => `/admin/building-variants/${i.id}/edit`}
        onDelete={(id) =>
          setDeleteTarget(items.find((i) => i.id === id) ?? null)
        }
      />
      {deleteTarget && (
        <DeleteModal
          name={`${deleteTarget.name} (${versionName(deleteTarget.gameVersionId)})`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

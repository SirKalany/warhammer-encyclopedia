"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  FactionVariantDTO,
  GameVersionDTO,
  FactionSummaryDTO,
} from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminFactionVariantsPage() {
  const [items, setItems] = useState<FactionVariantDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [factions, setFactions] = useState<FactionSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<FactionVariantDTO | null>(
    null,
  );

  useEffect(() => {
    Promise.all([api.versions.findAll(), api.factions.findAll()]).then(
      ([versions, factions]) => {
        setVersions(versions);
        setFactions(factions);
        // Load variants for all versions
        Promise.all(
          versions.map((v) => api.factionVariants.findByVersion(v.id)),
        ).then((results) => setItems(results.flat()));
      },
    );
  }, []);

  const handleDelete = async (id: number) => {
    await api.factionVariants.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const versionName = (id: number) =>
    versions.find((v) => v.id === id)?.name ?? "—";
  const factionName = (id: number) =>
    factions.find((f) => f.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Faction Variants</h1>
        <AddButton href="/admin/faction-variants/new" label="Add Variant" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Faction", render: (i) => factionName(i.factionId) },
          { label: "Version", render: (i) => versionName(i.gameVersionId) },
          { label: "Horde", render: (i) => (i.isHorde ? "Yes" : "No") },
        ]}
        editPath={(i) => `/admin/faction-variants/${i.id}/edit`}
        onDelete={(id) =>
          setDeleteTarget(items.find((i) => i.id === id) ?? null)
        }
      />
      {deleteTarget && (
        <DeleteModal
          name={`${factionName(deleteTarget.factionId)} (${versionName(deleteTarget.gameVersionId)})`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

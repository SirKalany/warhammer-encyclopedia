"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  SpellVariantSummaryDTO,
  GameVersionDTO,
  LoreOfMagicSummaryDTO,
} from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminSpellVariantsPage() {
  const [items, setItems] = useState<SpellVariantSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [lores, setLores] = useState<LoreOfMagicSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] =
    useState<SpellVariantSummaryDTO | null>(null);

  useEffect(() => {
    Promise.all([api.versions.findAll(), api.lores.findAll()]).then(
      ([versions, lores]) => {
        setVersions(versions);
        setLores(lores);
        Promise.all(
          versions.map((v) => api.spellVariants.findByVersion(v.id)),
        ).then((results) => setItems(results.flat()));
      },
    );
  }, []);

  const handleDelete = async (id: number) => {
    await api.spellVariants.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const versionName = (id: number) =>
    versions.find((v) => v.id === id)?.name ?? "—";
  const loreName = (id: number) => lores.find((l) => l.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Spell Variants</h1>
        <AddButton href="/admin/spell-variants/new" label="Add Variant" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Lore", render: (i) => loreName(i.loreId) },
          { label: "Version", render: (i) => versionName(i.gameVersionId) },
        ]}
        editPath={(i) => `/admin/spell-variants/${i.id}/edit`}
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

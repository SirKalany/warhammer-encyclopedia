"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ItemVariantSummaryDTO, GameVersionDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminItemVariantsPage() {
  const [items, setItems] = useState<ItemVariantSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [deleteTarget, setDeleteTarget] =
    useState<ItemVariantSummaryDTO | null>(null);

  useEffect(() => {
    api.versions.findAll().then((versions) => {
      setVersions(versions);
      Promise.all(
        versions.map((v) => api.itemVariants.findByVersion(v.id)),
      ).then((results) => setItems(results.flat()));
    });
  }, []);

  const handleDelete = async (id: number) => {
    await api.itemVariants.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const versionName = (id: number) =>
    versions.find((v) => v.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Item Variants</h1>
        <AddButton href="/admin/item-variants/new" label="Add Variant" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Category", render: (i) => i.category.replace(/_/g, " ") },
          { label: "Rarity", render: (i) => i.rarity },
          { label: "Version", render: (i) => versionName(i.gameVersionId) },
        ]}
        editPath={(i) => `/admin/item-variants/${i.id}/edit`}
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

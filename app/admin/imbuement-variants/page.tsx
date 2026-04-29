"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ImbuementVariantDTO, GameVersionDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminImbuementVariantsPage() {
  const [items, setItems] = useState<ImbuementVariantDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ImbuementVariantDTO | null>(
    null,
  );

  useEffect(() => {
    api.versions.findAll().then((versions) => {
      setVersions(versions);
      Promise.all(
        versions.map((v) => api.imbuementVariants.findByVersion(v.id)),
      ).then((results) => setItems(results.flat()));
    });
  }, []);

  const handleDelete = async (id: number) => {
    await api.imbuementVariants.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const versionName = (id: number) =>
    versions.find((v) => v.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Imbuement Variants</h1>
        <AddButton href="/admin/imbuement-variants/new" label="Add Variant" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Version", render: (i) => versionName(i.gameVersionId) },
          {
            label: "Icon",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.icon ?? "—"}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/imbuement-variants/${i.id}/edit`}
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

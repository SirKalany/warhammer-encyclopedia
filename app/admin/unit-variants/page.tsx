"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { UnitVariantSummaryDTO, GameVersionDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";
import Badge from "@/components/common/Badge";

export default function AdminUnitVariantsPage() {
  const [items, setItems] = useState<UnitVariantSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [deleteTarget, setDeleteTarget] =
    useState<UnitVariantSummaryDTO | null>(null);

  useEffect(() => {
    api.versions.findAll().then((versions) => {
      setVersions(versions);
      Promise.all(
        versions.map((v) => api.unitVariants.findByVersion(v.id)),
      ).then((results) => setItems(results.flat()));
    });
  }, []);

  const handleDelete = async (id: number) => {
    await api.unitVariants.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const versionName = (id: number) =>
    versions.find((v) => v.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Unit Variants</h1>
        <AddButton href="/admin/unit-variants/new" label="Add Variant" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          {
            label: "Role",
            render: (i) => (
              <span className="text-text-muted text-xs">
                {i.role.replace(/_/g, " ")}
              </span>
            ),
          },
          {
            label: "Type",
            render: (i) => <Badge label={i.categoryType} variant="default" />,
          },
          { label: "Version", render: (i) => versionName(i.gameVersionId) },
        ]}
        editPath={(i) => `/admin/unit-variants/${i.id}/edit`}
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

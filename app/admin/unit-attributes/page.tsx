"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { UnitAttributeDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import Link from "next/link";

export default function AdminUnitAttributesPage() {
  const [items, setItems] = useState<UnitAttributeDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<UnitAttributeDTO | null>(
    null,
  );

  useEffect(() => {
    api.unitAttributes.findAll().then(setItems);
  }, []);

  const handleDelete = async (id: number) => {
    await api.unitAttributes.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Unit Attributes</h1>
        <Link
          href="/admin/unit-attributes/new"
          className="font-display text-xs tracking-widest uppercase px-4 py-2 bg-gold-subtle border border-gold-bright text-gold-bright rounded-sm hover:bg-gold-dim hover:text-text-primary transition-all duration-150 no-underline"
        >
          + Add Attribute
        </Link>
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          {
            label: "Description",
            render: (i) => (
              <span className="text-text-muted text-xs">
                {i.description ?? "—"}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/unit-attributes/${i.id}/edit`}
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

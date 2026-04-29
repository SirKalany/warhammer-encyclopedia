"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ItemSummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminItemsPage() {
  const [items, setItems] = useState<ItemSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ItemSummaryDTO | null>(null);

  useEffect(() => {
    api.items.findAll().then(setItems);
  }, []);

  const handleDelete = async (id: number) => {
    await api.items.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Items</h1>
        <AddButton href="/admin/items/new" label="Add Item" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Category", render: (i) => i.category.replace(/_/g, " ") },
          { label: "Rarity", render: (i) => i.rarity },
          {
            label: "Slug",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.slug}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/items/${i.id}/edit`}
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

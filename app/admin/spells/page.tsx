"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SpellSummaryDTO, LoreOfMagicSummaryDTO } from "@/lib/types";
import AdminTable from "@/components/admin/AdminTable";
import DeleteModal from "@/components/admin/DeleteModal";
import AddButton from "@/components/admin/AddButton";

export default function AdminSpellsPage() {
  const [items, setItems] = useState<SpellSummaryDTO[]>([]);
  const [lores, setLores] = useState<LoreOfMagicSummaryDTO[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<SpellSummaryDTO | null>(
    null,
  );

  useEffect(() => {
    Promise.all([api.spells.findAll(), api.lores.findAll()]).then(
      ([spells, lores]) => {
        setItems(spells);
        setLores(lores);
      },
    );
  }, []);

  const handleDelete = async (id: number) => {
    await api.spells.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const loreName = (id: number) => lores.find((l) => l.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Spells</h1>
        <AddButton href="/admin/spells/new" label="Add Spell" />
      </div>
      <AdminTable
        items={items}
        columns={[
          { label: "Name", render: (i) => i.name },
          { label: "Lore", render: (i) => loreName(i.loreId) },
          {
            label: "Type",
            render: (i) => (
              <span className="text-text-muted text-xs">
                {i.type.replace(/_/g, " ")}
              </span>
            ),
          },
          {
            label: "Slug",
            render: (i) => (
              <span className="text-text-muted font-mono text-xs">
                {i.slug}
              </span>
            ),
          },
        ]}
        editPath={(i) => `/admin/spells/${i.id}/edit`}
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

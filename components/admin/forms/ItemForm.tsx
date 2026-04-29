"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ItemCategory, ItemRarity } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminFormField";

const CATEGORIES: ItemCategory[] = [
  "ARMOUR",
  "ENCHANTED_ITEM",
  "TALISMAN",
  "WEAPON",
  "ARCANE_ITEM",
];
const RARITIES: ItemRarity[] = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "LEGENDARY",
  "CRAFTED",
];

const CATEGORY_LABEL: Record<ItemCategory, string> = {
  ARMOUR: "Armour",
  ENCHANTED_ITEM: "Enchanted Item",
  TALISMAN: "Talisman",
  WEAPON: "Weapon",
  ARCANE_ITEM: "Arcane Item",
};

interface ItemFormProps {
  id?: number;
}

export default function ItemForm({ id }: ItemFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "" as ItemCategory,
    rarity: "" as ItemRarity,
  });

  useEffect(() => {
    if (isEdit) {
      api.items.findAll().then((items) => {
        const i = items.find((i) => i.id === id);
        if (i)
          setForm({
            name: i.name,
            slug: i.slug,
            category: i.category,
            rarity: i.rarity,
          });
      });
    }
  }, [id, isEdit]);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit
        ? prev.slug
        : name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        category: form.category,
        rarity: form.rarity,
      };
      if (isEdit) await api.items.update(id, payload);
      else await api.items.create(payload);
      router.push("/admin/items");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Item" : "New Item"}
      backHref="/admin/items"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Name" required>
          <AdminInput
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Sword of Khaine"
            required
          />
        </AdminFormField>
        <AdminFormField label="Slug" required hint="Auto-generated from name.">
          <AdminInput
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="e.g. sword-of-khaine"
            required
          />
        </AdminFormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Category" required>
          <AdminSelect
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                category: e.target.value as ItemCategory,
              }))
            }
            placeholder="Select category..."
            options={CATEGORIES.map((c) => ({
              value: c,
              label: CATEGORY_LABEL[c],
            }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Rarity" required>
          <AdminSelect
            value={form.rarity}
            onChange={(e) =>
              setForm((p) => ({ ...p, rarity: e.target.value as ItemRarity }))
            }
            placeholder="Select rarity..."
            options={RARITIES.map((r) => ({ value: r, label: r }))}
            required
          />
        </AdminFormField>
      </div>
    </AdminFormWrapper>
  );
}

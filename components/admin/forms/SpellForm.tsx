"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AbilityType, LoreOfMagicSummaryDTO } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminFormField";

const ABILITY_TYPES: AbilityType[] = [
  "AUGMENT",
  "REGENERATION",
  "HEX",
  "MAGIC_MISSILE",
  "WIND",
  "BREATH",
  "DIRECT_DAMAGE",
  "BOMBARDMENT",
  "EXPLOSION",
  "HIDING",
  "VORTEX",
  "SUMMON",
];

interface SpellFormProps {
  id?: number;
}

export default function SpellForm({ id }: SpellFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [lores, setLores] = useState<LoreOfMagicSummaryDTO[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "" as AbilityType,
    loreId: "",
  });

  useEffect(() => {
    api.lores.findAll().then(setLores);
    if (isEdit) {
      api.spells.findAll().then((spells) => {
        const s = spells.find((s) => s.id === id);
        if (s)
          setForm({
            name: s.name,
            slug: s.slug,
            type: s.type,
            loreId: String(s.loreId),
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
        type: form.type,
        loreId: Number(form.loreId),
      };
      if (isEdit) await api.spells.update(id, payload);
      else await api.spells.create(payload);
      router.push("/admin/spells");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Spell" : "New Spell"}
      backHref="/admin/spells"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Name" required>
          <AdminInput
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Fireball"
            required
          />
        </AdminFormField>
        <AdminFormField label="Slug" required hint="Auto-generated from name.">
          <AdminInput
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="e.g. fireball"
            required
          />
        </AdminFormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Type" required>
          <AdminSelect
            value={form.type}
            onChange={(e) =>
              setForm((p) => ({ ...p, type: e.target.value as AbilityType }))
            }
            placeholder="Select a type..."
            options={ABILITY_TYPES.map((t) => ({
              value: t,
              label: t.replace(/_/g, " "),
            }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Lore of Magic" required>
          <AdminSelect
            value={form.loreId}
            onChange={(e) => setForm((p) => ({ ...p, loreId: e.target.value }))}
            placeholder="Select a lore..."
            options={lores.map((l) => ({ value: String(l.id), label: l.name }))}
            required
          />
        </AdminFormField>
      </div>
    </AdminFormWrapper>
  );
}

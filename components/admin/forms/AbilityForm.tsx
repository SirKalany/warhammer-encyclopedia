"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AbilityType } from "@/lib/types";
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

interface AbilityFormProps {
  id?: number;
}

export default function AbilityForm({ id }: AbilityFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "" as AbilityType,
  });

  useEffect(() => {
    if (isEdit) {
      api.abilities.findAll().then((abilities) => {
        const a = abilities.find((a) => a.id === id);
        if (a) setForm({ name: a.name, slug: a.slug, type: a.type });
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
      const payload = { name: form.name, slug: form.slug, type: form.type };
      if (isEdit) await api.abilities.update(id, payload);
      else await api.abilities.create(payload);
      router.push("/admin/abilities");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Ability" : "New Ability"}
      backHref="/admin/abilities"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Name" required>
          <AdminInput
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Frenzy"
            required
          />
        </AdminFormField>
        <AdminFormField label="Slug" required hint="Auto-generated from name.">
          <AdminInput
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="e.g. frenzy"
            required
          />
        </AdminFormField>
      </div>
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
    </AdminFormWrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { RaceSummaryDTO } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminFormField";

interface FactionFormProps {
  id?: number;
}

export default function FactionForm({ id }: FactionFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", raceId: "" });

  useEffect(() => {
    api.races.findAll().then(setRaces);
    if (isEdit) {
      api.factions.findAll().then((factions) => {
        const f = factions.find((f) => f.id === id);
        if (f)
          setForm({ name: f.name, slug: f.slug, raceId: String(f.raceId) });
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
        raceId: Number(form.raceId),
      };
      if (isEdit) await api.factions.update(id, payload);
      else await api.factions.create(payload);
      router.push("/admin/factions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Faction" : "New Faction"}
      backHref="/admin/factions"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <AdminFormField label="Name" required>
        <AdminInput
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. The Empire"
          required
        />
      </AdminFormField>
      <AdminFormField label="Slug" required hint="Auto-generated from name.">
        <AdminInput
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="e.g. the-empire"
          required
        />
      </AdminFormField>
      <AdminFormField label="Race" required>
        <AdminSelect
          value={form.raceId}
          onChange={(e) => setForm((p) => ({ ...p, raceId: e.target.value }))}
          placeholder="Select a race..."
          options={races.map((r) => ({ value: String(r.id), label: r.name }))}
          required
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

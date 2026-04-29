"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { RaceSummaryDTO } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import { AdminFormField, AdminInput } from "@/components/admin/AdminFormField";

interface UnitFormProps {
  id?: number;
}

export default function UnitForm({ id }: UnitFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    raceIds: [] as number[],
  });

  useEffect(() => {
    api.races.findAll().then(setRaces);
    if (isEdit) {
      api.units.findAll().then((units) => {
        const u = units.find((u) => u.id === id);
        if (u) setForm({ name: u.name, slug: u.slug, raceIds: u.raceIds });
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

  const toggleRace = (raceId: number) => {
    setForm((prev) => ({
      ...prev,
      raceIds: prev.raceIds.includes(raceId)
        ? prev.raceIds.filter((id) => id !== raceId)
        : [...prev.raceIds, raceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) await api.units.update(id, form);
      else await api.units.create(form);
      router.push("/admin/units");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Unit" : "New Unit"}
      backHref="/admin/units"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Name" required>
          <AdminInput
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Bestigor Herd"
            required
          />
        </AdminFormField>
        <AdminFormField label="Slug" required hint="Auto-generated from name.">
          <AdminInput
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="e.g. bestigor-herd"
            required
          />
        </AdminFormField>
      </div>
      <AdminFormField
        label="Races"
        required
        hint="Click to toggle. A unit can belong to multiple races."
      >
        <div className="flex flex-wrap gap-2 mt-1">
          {races.map((race) => (
            <button
              key={race.id}
              type="button"
              onClick={() => toggleRace(race.id)}
              className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-sm border transition-all duration-150 ${form.raceIds.includes(race.id) ? "bg-gold-subtle border-gold-bright text-gold-bright" : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"}`}
            >
              {race.name}
            </button>
          ))}
        </div>
      </AdminFormField>
    </AdminFormWrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  RaceSummaryDTO,
  BuildingChainSummaryDTO,
  BuildingCategory,
} from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminFormField";

const CATEGORIES: BuildingCategory[] = [
  "SETTLEMENT",
  "PORT",
  "MILITARY_RECRUITMENT",
  "MILITARY_SUPPORT",
  "DEFENSE",
  "INFRASTRUCTURE",
  "RESOURCE",
  "LANDMARK",
];

const CATEGORY_LABEL: Record<BuildingCategory, string> = {
  SETTLEMENT: "Settlement",
  PORT: "Port",
  MILITARY_RECRUITMENT: "Military Recruitment",
  MILITARY_SUPPORT: "Military Support",
  DEFENSE: "Defense",
  INFRASTRUCTURE: "Infrastructure",
  RESOURCE: "Resource",
  LANDMARK: "Landmark",
};

interface BuildingFormProps {
  id?: number;
}

export default function BuildingForm({ id }: BuildingFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [chains, setChains] = useState<BuildingChainSummaryDTO[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    raceId: "",
    buildingChainId: "",
    category: "" as BuildingCategory,
  });

  useEffect(() => {
    Promise.all([api.races.findAll(), api.buildingChains.findAll()]).then(
      ([races, chains]) => {
        setRaces(races);
        setChains(chains);
      },
    );
    if (isEdit) {
      api.buildings.findAll().then((buildings) => {
        const b = buildings.find((b) => b.id === id);
        if (b)
          setForm({
            name: b.name,
            slug: b.slug,
            raceId: String(b.raceId),
            buildingChainId: b.buildingChainId ? String(b.buildingChainId) : "",
            category: b.category,
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

  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        raceId: Number(form.raceId),
        buildingChainId: form.buildingChainId
          ? Number(form.buildingChainId)
          : null,
        category: form.category,
      };
      if (isEdit) await api.buildings.update(id, payload);
      else await api.buildings.create(payload);
      router.push("/admin/buildings");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChains = chains.filter(
    (c) => !form.raceId || c.raceId === Number(form.raceId),
  );

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Building" : "New Building"}
      backHref="/admin/buildings"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Name" required>
          <AdminInput
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Barracks"
            required
          />
        </AdminFormField>
        <AdminFormField label="Slug" required hint="Auto-generated from name.">
          <AdminInput
            value={form.slug}
            onChange={set("slug")}
            placeholder="e.g. barracks"
            required
          />
        </AdminFormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Race" required>
          <AdminSelect
            value={form.raceId}
            onChange={set("raceId")}
            placeholder="Select race..."
            options={races.map((r) => ({ value: String(r.id), label: r.name }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Category" required>
          <AdminSelect
            value={form.category}
            onChange={set("category")}
            placeholder="Select category..."
            options={CATEGORIES.map((c) => ({
              value: c,
              label: CATEGORY_LABEL[c],
            }))}
            required
          />
        </AdminFormField>
      </div>
      <AdminFormField
        label="Building Chain"
        hint="Leave empty for standalone buildings"
      >
        <AdminSelect
          value={form.buildingChainId}
          onChange={set("buildingChainId")}
          placeholder="No chain (standalone)"
          options={filteredChains.map((c) => ({
            value: String(c.id),
            label: c.name,
          }))}
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { RaceSummaryDTO, BuildingCategory } from "@/lib/types";
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

interface BuildingChainFormProps {
  id?: number;
}

export default function BuildingChainForm({ id }: BuildingChainFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    raceId: "",
    category: "" as BuildingCategory,
  });

  useEffect(() => {
    api.races.findAll().then(setRaces);
    if (isEdit) {
      api.buildingChains.findAll().then((chains) => {
        const c = chains.find((c) => c.id === id);
        if (c)
          setForm({
            name: c.name,
            slug: c.slug,
            raceId: String(c.raceId),
            category: c.category,
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
        category: form.category,
      };
      if (isEdit) await api.buildingChains.update(id, payload);
      else await api.buildingChains.create(payload);
      router.push("/admin/building-chains");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Building Chain" : "New Building Chain"}
      backHref="/admin/building-chains"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Name" required>
          <AdminInput
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Barracks Chain"
            required
          />
        </AdminFormField>
        <AdminFormField label="Slug" required hint="Auto-generated from name.">
          <AdminInput
            value={form.slug}
            onChange={set("slug")}
            placeholder="e.g. barracks-chain"
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
    </AdminFormWrapper>
  );
}

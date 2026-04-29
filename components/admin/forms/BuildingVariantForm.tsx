"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { BuildingSummaryDTO, GameVersionDTO } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/components/admin/AdminFormField";

interface BuildingVariantFormProps {
  id?: number;
}

export default function BuildingVariantForm({ id }: BuildingVariantFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [buildings, setBuildings] = useState<BuildingSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [form, setForm] = useState({
    buildingId: "",
    gameVersionId: "",
    picture: "",
    tier: "",
    effect: "",
    cost: "",
    requirements: "",
  });

  useEffect(() => {
    Promise.all([api.buildings.findAll(), api.versions.findAll()]).then(
      ([buildings, versions]) => {
        setBuildings(buildings);
        setVersions(versions);
      },
    );
    if (isEdit) {
      api.versions.findAll().then((versions) => {
        Promise.all(
          versions.map((v) => api.buildingVariants.findByVersion(v.id)),
        ).then((results) => {
          const variant = results.flat().find((bv) => bv.id === id);
          if (variant) {
            api.buildingVariants
              .findByBuildingAndVersion(
                variant.buildingId,
                variant.gameVersionId,
              )
              .then((full) => {
                setForm({
                  buildingId: String(full.buildingId),
                  gameVersionId: String(full.gameVersionId),
                  picture: full.picture ?? "",
                  tier: full.tier?.toString() ?? "",
                  effect: full.effect ?? "",
                  cost: full.cost?.toString() ?? "",
                  requirements: full.requirements ?? "",
                });
              });
          }
        });
      });
    }
  }, [id, isEdit]);

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const building = buildings.find((b) => b.id === Number(form.buildingId));
      const payload = {
        buildingId: Number(form.buildingId),
        name: building?.name ?? "",
        slug: building?.slug ?? "",
        category: building?.category ?? ("SETTLEMENT" as const),
        raceId: building?.raceId ?? 0,
        buildingChainId: building?.buildingChainId ?? null,
        gameVersionId: Number(form.gameVersionId),
        picture: form.picture || null,
        tier: form.tier ? (Number(form.tier) as 1 | 2 | 3 | 4 | 5) : null,
        effect: form.effect || null,
        cost: form.cost ? Number(form.cost) : null,
        requirements: form.requirements || null,
      };
      if (isEdit) await api.buildingVariants.update(id, payload);
      else await api.buildingVariants.create(payload);
      router.push("/admin/building-variants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Building Variant" : "New Building Variant"}
      backHref="/admin/building-variants"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Building" required>
          <AdminSelect
            value={form.buildingId}
            onChange={set("buildingId")}
            placeholder="Select building..."
            options={buildings.map((b) => ({
              value: String(b.id),
              label: b.name,
            }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Game Version" required>
          <AdminSelect
            value={form.gameVersionId}
            onChange={set("gameVersionId")}
            placeholder="Select version..."
            options={versions.map((v) => ({
              value: String(v.id),
              label: v.name,
            }))}
            required
          />
        </AdminFormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminFormField label="Tier" hint="1 to 5">
          <AdminSelect
            value={form.tier}
            onChange={set("tier")}
            placeholder="No tier"
            options={[1, 2, 3, 4, 5].map((t) => ({
              value: String(t),
              label: `Tier ${t}`,
            }))}
          />
        </AdminFormField>
        <AdminFormField label="Cost">
          <AdminInput
            type="number"
            value={form.cost}
            onChange={set("cost")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Picture" hint="Path to image">
          <AdminInput
            value={form.picture}
            onChange={set("picture")}
            placeholder="/images/buildings/..."
          />
        </AdminFormField>
      </div>
      <AdminFormField label="Effect">
        <AdminTextarea
          value={form.effect}
          onChange={set("effect")}
          placeholder="What this building does..."
        />
      </AdminFormField>
      <AdminFormField label="Requirements">
        <AdminTextarea
          value={form.requirements}
          onChange={set("requirements")}
          placeholder="e.g. Requires settlement tier 3..."
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

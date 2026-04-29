"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AbilitySummaryDTO, GameVersionDTO } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/components/admin/AdminFormField";

interface AbilityVariantFormProps {
  id?: number;
}

export default function AbilityVariantForm({ id }: AbilityVariantFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [abilities, setAbilities] = useState<AbilitySummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [form, setForm] = useState({
    abilityId: "",
    gameVersionId: "",
    description: "",
    effect: "",
    target: "",
    range: "",
    radius: "",
    duration: "",
    cooldown: "",
    affectedUnits: "",
    uses: "",
    conditions: "",
    baseDamage: "",
    explosiveDamage: "",
    damagePerSecond: "",
    movementSpeed: "",
  });

  useEffect(() => {
    Promise.all([api.abilities.findAll(), api.versions.findAll()]).then(
      ([abilities, versions]) => {
        setAbilities(abilities);
        setVersions(versions);
      },
    );
    if (isEdit) {
      api.versions.findAll().then((versions) => {
        Promise.all(
          versions.map((v) => api.abilityVariants.findByVersion(v.id)),
        ).then((results) => {
          const variant = results.flat().find((av) => av.id === id);
          if (variant) {
            api.abilityVariants
              .findByAbilityAndVersion(variant.abilityId, variant.gameVersionId)
              .then((full) => {
                setForm({
                  abilityId: String(full.abilityId),
                  gameVersionId: String(full.gameVersionId),
                  description: full.description ?? "",
                  effect: full.effect ?? "",
                  target: full.target ?? "",
                  range: full.range?.toString() ?? "",
                  radius: full.radius?.toString() ?? "",
                  duration: full.duration?.toString() ?? "",
                  cooldown: full.cooldown?.toString() ?? "",
                  affectedUnits: full.affectedUnits?.toString() ?? "",
                  uses: full.uses?.toString() ?? "",
                  conditions: full.conditions ?? "",
                  baseDamage: full.baseDamage?.toString() ?? "",
                  explosiveDamage: full.explosiveDamage?.toString() ?? "",
                  damagePerSecond: full.damagePerSecond?.toString() ?? "",
                  movementSpeed: full.movementSpeed?.toString() ?? "",
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
      const ability = abilities.find((a) => a.id === Number(form.abilityId));
      const payload = {
        abilityId: Number(form.abilityId),
        name: ability?.name ?? "",
        slug: ability?.slug ?? "",
        type: ability?.type ?? ("AUGMENT" as const),
        gameVersionId: Number(form.gameVersionId),
        description: form.description || null,
        effect: form.effect || null,
        target: form.target || null,
        range: form.range ? Number(form.range) : null,
        radius: form.radius ? Number(form.radius) : null,
        duration: form.duration ? Number(form.duration) : null,
        cooldown: form.cooldown ? Number(form.cooldown) : null,
        affectedUnits: form.affectedUnits ? Number(form.affectedUnits) : null,
        uses: form.uses ? Number(form.uses) : null,
        conditions: form.conditions || null,
        baseDamage: form.baseDamage ? Number(form.baseDamage) : null,
        explosiveDamage: form.explosiveDamage
          ? Number(form.explosiveDamage)
          : null,
        damagePerSecond: form.damagePerSecond
          ? Number(form.damagePerSecond)
          : null,
        movementSpeed: form.movementSpeed ? Number(form.movementSpeed) : null,
      };
      if (isEdit) await api.abilityVariants.update(id, payload);
      else await api.abilityVariants.create(payload);
      router.push("/admin/ability-variants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Ability Variant" : "New Ability Variant"}
      backHref="/admin/ability-variants"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Ability" required>
          <AdminSelect
            value={form.abilityId}
            onChange={set("abilityId")}
            placeholder="Select ability..."
            options={abilities.map((a) => ({
              value: String(a.id),
              label: a.name,
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
      <AdminFormField label="Description">
        <AdminTextarea
          value={form.description}
          onChange={set("description")}
          placeholder="Description of this ability..."
        />
      </AdminFormField>
      <AdminFormField label="Effect">
        <AdminTextarea
          value={form.effect}
          onChange={set("effect")}
          placeholder="What this ability does..."
        />
      </AdminFormField>
      <AdminFormField label="Target">
        <AdminInput
          value={form.target}
          onChange={set("target")}
          placeholder="e.g. Self, Friendly units..."
        />
      </AdminFormField>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminFormField label="Range">
          <AdminInput
            type="number"
            value={form.range}
            onChange={set("range")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Radius">
          <AdminInput
            type="number"
            value={form.radius}
            onChange={set("radius")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Duration">
          <AdminInput
            type="number"
            value={form.duration}
            onChange={set("duration")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Cooldown">
          <AdminInput
            type="number"
            value={form.cooldown}
            onChange={set("cooldown")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Affected Units">
          <AdminInput
            type="number"
            value={form.affectedUnits}
            onChange={set("affectedUnits")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Uses">
          <AdminInput
            type="number"
            value={form.uses}
            onChange={set("uses")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Base Damage">
          <AdminInput
            type="number"
            value={form.baseDamage}
            onChange={set("baseDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Explosive Damage">
          <AdminInput
            type="number"
            value={form.explosiveDamage}
            onChange={set("explosiveDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Damage/Second">
          <AdminInput
            type="number"
            value={form.damagePerSecond}
            onChange={set("damagePerSecond")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Movement Speed">
          <AdminInput
            type="number"
            value={form.movementSpeed}
            onChange={set("movementSpeed")}
            placeholder="0"
          />
        </AdminFormField>
      </div>
      <AdminFormField label="Conditions">
        <AdminTextarea
          value={form.conditions}
          onChange={set("conditions")}
          placeholder="Any conditions limiting this ability..."
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

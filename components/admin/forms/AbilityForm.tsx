"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AbilityType } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
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
    if (isEdit) {
      api.abilities.findAll().then((abilities) => {
        const summary = abilities.find((a) => a.id === id);
        if (summary)
          api.abilities.findBySlug(summary.slug).then((a) => {
            setForm({
              name: a.name,
              slug: a.slug,
              type: a.type,
              effect: a.effect ?? "",
              target: a.target ?? "",
              range: a.range?.toString() ?? "",
              radius: a.radius?.toString() ?? "",
              duration: a.duration?.toString() ?? "",
              cooldown: a.cooldown?.toString() ?? "",
              affectedUnits: a.affectedUnits?.toString() ?? "",
              uses: a.uses?.toString() ?? "",
              conditions: a.conditions ?? "",
              baseDamage: a.baseDamage?.toString() ?? "",
              explosiveDamage: a.explosiveDamage?.toString() ?? "",
              damagePerSecond: a.damagePerSecond?.toString() ?? "",
              movementSpeed: a.movementSpeed?.toString() ?? "",
            });
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
      const payload = {
        name: form.name,
        slug: form.slug,
        type: form.type as AbilityType,
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
      if (isEdit) {
        await api.abilities.update(id, payload);
      } else {
        await api.abilities.create(payload);
      }
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
        <AdminFormField label="Slug" required>
          <AdminInput
            value={form.slug}
            onChange={set("slug")}
            placeholder="e.g. frenzy"
            required
          />
        </AdminFormField>
      </div>

      <AdminFormField label="Type" required>
        <AdminSelect
          value={form.type}
          onChange={set("type")}
          placeholder="Select a type..."
          options={ABILITY_TYPES.map((t) => ({
            value: t,
            label: t.replace(/_/g, " "),
          }))}
          required
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        <AdminFormField label="Damage per Second">
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

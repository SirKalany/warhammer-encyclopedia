"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { SpellSummaryDTO, GameVersionDTO } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/components/admin/AdminFormField";

interface SpellVariantFormProps {
  id?: number;
}

export default function SpellVariantForm({ id }: SpellVariantFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [spells, setSpells] = useState<SpellSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [form, setForm] = useState({
    spellId: "",
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
    cost: "",
    miscastChance: "",
    overcastEffect: "",
    overcastTarget: "",
    overcastRange: "",
    overcastRadius: "",
    overcastDuration: "",
    overcastCooldown: "",
    overcastAffectedUnits: "",
    overcastBaseDamage: "",
    overcastExplosiveDamage: "",
    overcastDamagePerSecond: "",
    overcastMovementSpeed: "",
    overcastCost: "",
    overcastMiscastChance: "",
  });

  useEffect(() => {
    Promise.all([api.spells.findAll(), api.versions.findAll()]).then(
      ([spells, versions]) => {
        setSpells(spells);
        setVersions(versions);
      },
    );
    if (isEdit) {
      api.versions.findAll().then((versions) => {
        Promise.all(
          versions.map((v) => api.spellVariants.findByVersion(v.id)),
        ).then((results) => {
          const variant = results.flat().find((sv) => sv.id === id);
          if (variant) {
            api.spellVariants
              .findBySpellAndVersion(variant.spellId, variant.gameVersionId)
              .then((full) => {
                setForm({
                  spellId: String(full.spellId),
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
                  cost: full.cost?.toString() ?? "",
                  miscastChance: full.miscastChance?.toString() ?? "",
                  overcastEffect: full.overcastEffect ?? "",
                  overcastTarget: full.overcastTarget ?? "",
                  overcastRange: full.overcastRange?.toString() ?? "",
                  overcastRadius: full.overcastRadius?.toString() ?? "",
                  overcastDuration: full.overcastDuration?.toString() ?? "",
                  overcastCooldown: full.overcastCooldown?.toString() ?? "",
                  overcastAffectedUnits:
                    full.overcastAffectedUnits?.toString() ?? "",
                  overcastBaseDamage: full.overcastBaseDamage?.toString() ?? "",
                  overcastExplosiveDamage:
                    full.overcastExplosiveDamage?.toString() ?? "",
                  overcastDamagePerSecond:
                    full.overcastDamagePerSecond?.toString() ?? "",
                  overcastMovementSpeed:
                    full.overcastMovementSpeed?.toString() ?? "",
                  overcastCost: full.overcastCost?.toString() ?? "",
                  overcastMiscastChance:
                    full.overcastMiscastChance?.toString() ?? "",
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

  const num = (val: string) => (val ? Number(val) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const spell = spells.find((s) => s.id === Number(form.spellId));
      const payload = {
        spellId: Number(form.spellId),
        name: spell?.name ?? "",
        slug: spell?.slug ?? "",
        type: spell?.type ?? ("AUGMENT" as const),
        loreId: spell?.loreId ?? 0,
        gameVersionId: Number(form.gameVersionId),
        description: form.description || null,
        effect: form.effect || null,
        target: form.target || null,
        range: num(form.range),
        radius: num(form.radius),
        duration: num(form.duration),
        cooldown: num(form.cooldown),
        affectedUnits: num(form.affectedUnits),
        uses: num(form.uses),
        conditions: form.conditions || null,
        baseDamage: num(form.baseDamage),
        explosiveDamage: num(form.explosiveDamage),
        damagePerSecond: num(form.damagePerSecond),
        movementSpeed: num(form.movementSpeed),
        cost: num(form.cost),
        miscastChance: num(form.miscastChance),
        overcastEffect: form.overcastEffect || null,
        overcastTarget: form.overcastTarget || null,
        overcastRange: num(form.overcastRange),
        overcastRadius: num(form.overcastRadius),
        overcastDuration: num(form.overcastDuration),
        overcastCooldown: num(form.overcastCooldown),
        overcastAffectedUnits: num(form.overcastAffectedUnits),
        overcastBaseDamage: num(form.overcastBaseDamage),
        overcastExplosiveDamage: num(form.overcastExplosiveDamage),
        overcastDamagePerSecond: num(form.overcastDamagePerSecond),
        overcastMovementSpeed: num(form.overcastMovementSpeed),
        overcastCost: num(form.overcastCost),
        overcastMiscastChance: num(form.overcastMiscastChance),
      };
      if (isEdit) await api.spellVariants.update(id, payload);
      else await api.spellVariants.create(payload);
      router.push("/admin/spell-variants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Spell Variant" : "New Spell Variant"}
      backHref="/admin/spell-variants"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Spell" required>
          <AdminSelect
            value={form.spellId}
            onChange={set("spellId")}
            placeholder="Select spell..."
            options={spells.map((s) => ({
              value: String(s.id),
              label: s.name,
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
          placeholder="Description of this spell..."
        />
      </AdminFormField>
      <AdminFormField label="Effect">
        <AdminTextarea
          value={form.effect}
          onChange={set("effect")}
          placeholder="What this spell does..."
        />
      </AdminFormField>
      <AdminFormField label="Target">
        <AdminInput
          value={form.target}
          onChange={set("target")}
          placeholder="e.g. Enemy unit"
        />
      </AdminFormField>

      {/* Base stats */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Base Statistics
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminFormField label="Cost">
          <AdminInput
            type="number"
            value={form.cost}
            onChange={set("cost")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Miscast Chance">
          <AdminInput
            type="number"
            value={form.miscastChance}
            onChange={set("miscastChance")}
            placeholder="0"
          />
        </AdminFormField>
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
          placeholder="Any conditions..."
        />
      </AdminFormField>

      {/* Overcast stats */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Overcast Statistics{" "}
        <span className="text-text-muted normal-case font-body tracking-normal">
          (leave blank if unchanged from base)
        </span>
      </p>
      <AdminFormField label="Overcast Effect">
        <AdminTextarea
          value={form.overcastEffect}
          onChange={set("overcastEffect")}
          placeholder="Overcast effect description..."
        />
      </AdminFormField>
      <AdminFormField label="Overcast Target">
        <AdminInput
          value={form.overcastTarget}
          onChange={set("overcastTarget")}
          placeholder="e.g. Enemy unit"
        />
      </AdminFormField>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminFormField label="Overcast Cost">
          <AdminInput
            type="number"
            value={form.overcastCost}
            onChange={set("overcastCost")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Miscast">
          <AdminInput
            type="number"
            value={form.overcastMiscastChance}
            onChange={set("overcastMiscastChance")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Range">
          <AdminInput
            type="number"
            value={form.overcastRange}
            onChange={set("overcastRange")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Radius">
          <AdminInput
            type="number"
            value={form.overcastRadius}
            onChange={set("overcastRadius")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Duration">
          <AdminInput
            type="number"
            value={form.overcastDuration}
            onChange={set("overcastDuration")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Cooldown">
          <AdminInput
            type="number"
            value={form.overcastCooldown}
            onChange={set("overcastCooldown")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Aff. Units">
          <AdminInput
            type="number"
            value={form.overcastAffectedUnits}
            onChange={set("overcastAffectedUnits")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Base Dmg">
          <AdminInput
            type="number"
            value={form.overcastBaseDamage}
            onChange={set("overcastBaseDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Exp. Dmg">
          <AdminInput
            type="number"
            value={form.overcastExplosiveDamage}
            onChange={set("overcastExplosiveDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast DPS">
          <AdminInput
            type="number"
            value={form.overcastDamagePerSecond}
            onChange={set("overcastDamagePerSecond")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Overcast Move Spd">
          <AdminInput
            type="number"
            value={form.overcastMovementSpeed}
            onChange={set("overcastMovementSpeed")}
            placeholder="0"
          />
        </AdminFormField>
      </div>
    </AdminFormWrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  ItemSummaryDTO,
  GameVersionDTO,
  RaceSummaryDTO,
  AbilityVariantSummaryDTO,
  SpellVariantSummaryDTO,
} from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/components/admin/AdminFormField";

interface ItemVariantFormProps {
  id?: number;
}

export default function ItemVariantForm({ id }: ItemVariantFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ItemSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [races, setRaces] = useState<RaceSummaryDTO[]>([]);
  const [abilities, setAbilities] = useState<AbilityVariantSummaryDTO[]>([]);
  const [spells, setSpells] = useState<SpellVariantSummaryDTO[]>([]);
  const [form, setForm] = useState({
    itemId: "",
    gameVersionId: "",
    picture: "",
    effect: "",
    raceId: "",
    abilityVariantIds: [] as number[],
    spellVariantIds: [] as number[],
  });

  useEffect(() => {
    Promise.all([
      api.items.findAll(),
      api.versions.findAll(),
      api.races.findAll(),
    ]).then(([items, versions, races]) => {
      setItems(items);
      setVersions(versions);
      setRaces(races);
    });
    if (isEdit) {
      api.versions.findAll().then((versions) => {
        Promise.all(
          versions.map((v) => api.itemVariants.findByVersion(v.id)),
        ).then((results) => {
          const variant = results.flat().find((iv) => iv.id === id);
          if (variant) {
            api.itemVariants
              .findByItemAndVersion(variant.itemId, variant.gameVersionId)
              .then((full) => {
                setForm({
                  itemId: String(full.itemId),
                  gameVersionId: String(full.gameVersionId),
                  picture: full.picture ?? "",
                  effect: full.effect ?? "",
                  raceId: full.raceId ? String(full.raceId) : "",
                  abilityVariantIds: full.abilityVariantIds,
                  spellVariantIds: full.spellVariantIds,
                });
                // Load ability/spell variants for the selected version
                loadVariantsForVersion(full.gameVersionId);
              });
          }
        });
      });
    }
  }, [id, isEdit]);

  const loadVariantsForVersion = async (versionId: number) => {
    const [abilities, spells] = await Promise.all([
      api.abilityVariants.findByVersion(versionId),
      api.spellVariants.findByVersion(versionId),
    ]);
    setAbilities(abilities);
    setSpells(spells);
  };

  const handleVersionChange = (versionId: string) => {
    setForm((p) => ({
      ...p,
      gameVersionId: versionId,
      abilityVariantIds: [],
      spellVariantIds: [],
    }));
    if (versionId) loadVariantsForVersion(Number(versionId));
  };

  const toggleAbility = (abilityId: number) => {
    setForm((p) => ({
      ...p,
      abilityVariantIds: p.abilityVariantIds.includes(abilityId)
        ? p.abilityVariantIds.filter((id) => id !== abilityId)
        : [...p.abilityVariantIds, abilityId],
    }));
  };

  const toggleSpell = (spellId: number) => {
    setForm((p) => ({
      ...p,
      spellVariantIds: p.spellVariantIds.includes(spellId)
        ? p.spellVariantIds.filter((id) => id !== spellId)
        : [...p.spellVariantIds, spellId],
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
      const item = items.find((i) => i.id === Number(form.itemId));
      const payload = {
        itemId: Number(form.itemId),
        name: item?.name ?? "",
        slug: item?.slug ?? "",
        category: item?.category ?? ("WEAPON" as const),
        rarity: item?.rarity ?? ("COMMON" as const),
        gameVersionId: Number(form.gameVersionId),
        picture: form.picture || null,
        effect: form.effect || null,
        raceId: form.raceId ? Number(form.raceId) : null,
        abilityVariantIds: form.abilityVariantIds,
        spellVariantIds: form.spellVariantIds,
      };
      if (isEdit) await api.itemVariants.update(id, payload);
      else await api.itemVariants.create(payload);
      router.push("/admin/item-variants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Item Variant" : "New Item Variant"}
      backHref="/admin/item-variants"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Item" required>
          <AdminSelect
            value={form.itemId}
            onChange={set("itemId")}
            placeholder="Select item..."
            options={items.map((i) => ({ value: String(i.id), label: i.name }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Game Version" required>
          <AdminSelect
            value={form.gameVersionId}
            onChange={(e) => handleVersionChange(e.target.value)}
            placeholder="Select version..."
            options={versions.map((v) => ({
              value: String(v.id),
              label: v.name,
            }))}
            required
          />
        </AdminFormField>
      </div>

      <AdminFormField
        label="Picture"
        hint="Path to image e.g. /images/items/sword-of-khaine.webp"
      >
        <AdminInput
          value={form.picture}
          onChange={set("picture")}
          placeholder="/images/items/..."
        />
      </AdminFormField>

      <AdminFormField label="Effect">
        <AdminTextarea
          value={form.effect}
          onChange={set("effect")}
          placeholder="What this item does..."
        />
      </AdminFormField>

      <AdminFormField
        label="Race Restriction"
        hint="Leave empty if available to all races"
      >
        <AdminSelect
          value={form.raceId}
          onChange={set("raceId")}
          placeholder="No restriction"
          options={races.map((r) => ({ value: String(r.id), label: r.name }))}
        />
      </AdminFormField>

      {/* Granted Abilities */}
      {abilities.length > 0 && (
        <AdminFormField label="Granted Abilities" hint="Click to toggle">
          <div className="flex flex-wrap gap-2 mt-1">
            {abilities.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAbility(a.id)}
                className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-sm border transition-all duration-150 ${form.abilityVariantIds.includes(a.id) ? "bg-gold-subtle border-gold-bright text-gold-bright" : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"}`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </AdminFormField>
      )}

      {/* Granted Spells */}
      {spells.length > 0 && (
        <AdminFormField label="Granted Spells" hint="Click to toggle">
          <div className="flex flex-wrap gap-2 mt-1">
            {spells.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSpell(s.id)}
                className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-sm border transition-all duration-150 ${form.spellVariantIds.includes(s.id) ? "bg-gold-subtle border-gold-bright text-gold-bright" : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </AdminFormField>
      )}
    </AdminFormWrapper>
  );
}

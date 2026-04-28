"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { SpellVariantDTO, LoreOfMagicDTO } from "@/lib/types";
import { useVersion } from "@/lib/VersionContext";
import OvercastToggle from "@/components/spells/OvercastToggle";
import Badge from "@/components/common/Badge";
import Link from "next/link";

const TYPE_VARIANT: Record<
  string,
  "default" | "gold" | "good" | "warn" | "bad"
> = {
  AUGMENT: "good",
  REGENERATION: "good",
  HEX: "bad",
  MAGIC_MISSILE: "warn",
  WIND: "warn",
  BREATH: "warn",
  DIRECT_DAMAGE: "bad",
  BOMBARDMENT: "bad",
  EXPLOSION: "bad",
  HIDING: "default",
  VORTEX: "bad",
  SUMMON: "gold",
};

export default function SpellDetailPage() {
  const { loreSlug, spellSlug } = useParams<{
    loreSlug: string;
    spellSlug: string;
  }>();
  const { versionId } = useVersion();
  const [lore, setLore] = useState<LoreOfMagicDTO | null>(null);
  const [spell, setSpell] = useState<SpellVariantDTO | null>(null);

  useEffect(() => {
    async function load() {
      const loreData = await api.lores.findBySlug(loreSlug);
      setLore(loreData);
      const spells = await api.spells.findAll(loreData.id);
      const found = spells.find((s) => s.slug === spellSlug);
      if (!found) return;
      const variant = await api.spellVariants.findBySpellAndVersion(
        found.id,
        versionId,
      );
      setSpell(variant);
    }
    load();
  }, [loreSlug, spellSlug, versionId]);

  if (!spell)
    return (
      <p className="text-text-muted italic">
        Spell not found for this version.
      </p>
    );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/spells"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Spells
        </Link>
        <span>›</span>
        <Link
          href={`/spells/${loreSlug}`}
          className="hover:text-gold-bright transition-colors duration-150"
        >
          {lore?.name}
        </Link>
        <span>›</span>
        <span className="text-text-primary">{spell.name}</span>
      </div>

      <div className="space-y-2">
        <Badge
          label={spell.type.replace(/_/g, " ")}
          variant={TYPE_VARIANT[spell.type] ?? "default"}
        />
        <h1 className="text-3xl">{spell.name}</h1>
      </div>

      <OvercastToggle spell={spell} />

      {spell.conditions && (
        <div className="bg-bg-surface border border-border-subtle rounded-md px-4 py-3 text-sm text-text-secondary">
          <span className="text-text-muted font-display text-xs tracking-widest uppercase mr-2">
            Conditions:
          </span>
          {spell.conditions}
        </div>
      )}
    </div>
  );
}

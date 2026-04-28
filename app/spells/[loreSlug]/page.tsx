"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { SpellVariantSummaryDTO, LoreOfMagicDTO } from "@/lib/types";
import { useVersion } from "@/lib/VersionContext";
import SpellCard from "@/components/spells/SpellCard";
import Link from "next/link";

export default function LoreSpellsPage() {
  const { loreSlug } = useParams<{ loreSlug: string }>();
  const { versionId } = useVersion();
  const [lore, setLore] = useState<LoreOfMagicDTO | null>(null);
  const [spells, setSpells] = useState<SpellVariantSummaryDTO[]>([]);

  useEffect(() => {
    async function load() {
      const loreData = await api.lores.findBySlug(loreSlug);
      setLore(loreData);
      const spellData = await api.spellVariants.findByVersion(
        versionId,
        loreData.id,
      );
      setSpells(spellData);
    }
    load();
  }, [loreSlug, versionId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/spells"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Spells
        </Link>
        <span>›</span>
        <span className="text-text-primary">{lore?.name}</span>
      </div>

      <h1 className="text-3xl mb-2">{lore?.name}</h1>

      {spells.length === 0 ? (
        <p className="text-text-muted italic">
          No spells found for this lore in this version.
        </p>
      ) : (
        <div className="space-y-2">
          {spells.map((spell) => (
            <SpellCard key={spell.id} spell={spell} />
          ))}
        </div>
      )}
    </div>
  );
}

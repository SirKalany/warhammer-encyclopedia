"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoreOfMagicSummaryDTO } from "@/lib/types";
import { useVersion } from "@/lib/VersionContext";
import Link from "next/link";

export default function SpellsPage() {
  const { versionId } = useVersion();
  const [lores, setLores] = useState<LoreOfMagicSummaryDTO[]>([]);

  useEffect(() => {
    // Lores are identity — but we only show lores that have spell variants
    // in the selected version. For now fetch all lores.
    api.lores.findAll().then(setLores);
  }, [versionId]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl mb-2">Spells</h1>
        <p className="text-text-secondary italic">
          Select a lore of magic to browse its spells.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lores.map((lore) => (
          <Link
            key={lore.id}
            href={`/spells/${lore.slug}`}
            className="
                            group relative bg-bg-surface border border-border-subtle
                            rounded-md p-5 no-underline
                            hover:border-gold-dim hover:bg-bg-raised
                            transition-all duration-150
                        "
          >
            <div
              className="
                            absolute left-0 top-0 bottom-0 w-0.5 rounded-l-md
                            bg-gold-bright opacity-0 group-hover:opacity-100
                            transition-opacity duration-150
                        "
            />
            <span className="text-gold-dim text-lg mr-2">✧</span>
            <h2 className="text-base inline group-hover:text-gold-bright transition-colors duration-150">
              {lore.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

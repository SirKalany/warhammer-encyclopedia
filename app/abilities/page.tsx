"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AbilityVariantSummaryDTO, AbilityType } from "@/lib/types";
import { useVersion } from "@/lib/VersionContext";
import AbilityCard from "@/components/abilities/AbilityCard";
import SearchBar from "@/components/common/SearchBar";

const TYPES: AbilityType[] = [
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

export default function AbilitiesPage() {
  const { versionId } = useVersion();
  const [abilities, setAbilities] = useState<AbilityVariantSummaryDTO[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<AbilityType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.abilityVariants.findByVersion(versionId).then((data) => {
      setAbilities(data);
      setLoading(false);
    });
  }, [versionId]);

  const filtered = abilities.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType ? a.type === selectedType : true;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Abilities</h1>
        <p className="text-text-secondary italic">
          Browse all active and passive abilities.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar placeholder="Search abilities..." onSearch={setSearch} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType(null)}
            className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1.5 rounded-sm border transition-all duration-150 ${selectedType === null ? "bg-gold-subtle border-gold-bright text-gold-bright" : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"}`}
          >
            All
          </button>
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() =>
                setSelectedType(type === selectedType ? null : type)
              }
              className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1.5 rounded-sm border transition-all duration-150 ${selectedType === type ? "bg-gold-subtle border-gold-bright text-gold-bright" : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"}`}
            >
              {type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-text-muted italic">Loading abilities...</p>
      ) : filtered.length === 0 ? (
        <p className="text-text-muted italic">No abilities found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((ability) => (
            <AbilityCard key={ability.id} ability={ability} />
          ))}
        </div>
      )}
    </div>
  );
}

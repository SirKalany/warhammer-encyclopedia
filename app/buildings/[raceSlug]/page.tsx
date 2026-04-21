"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import {
  BuildingSummaryDTO,
  BuildingChainSummaryDTO,
  BuildingCategory,
} from "@/lib/types";
import Link from "next/link";
import Badge from "@/components/common/Badge";
import SearchBar from "@/components/common/SearchBar";

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

const TIER_LABEL: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
};

export default function BuildingsByRacePage() {
  const { raceSlug } = useParams<{ raceSlug: string }>();
  const [raceName, setRaceName] = useState("");
  const [raceId, setRaceId] = useState<number | null>(null);
  const [chains, setChains] = useState<BuildingChainSummaryDTO[]>([]);
  const [standalones, setStandalones] = useState<BuildingSummaryDTO[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<BuildingCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const races = await api.races.findAll();
      const race = races.find((r) => r.slug === raceSlug);
      if (!race) return;
      setRaceName(race.name);
      setRaceId(race.id);

      const [allChains, allBuildings] = await Promise.all([
        api.buildingChains.findByRace(race.id),
        api.buildings.findByRace(race.id),
      ]);

      setChains(allChains);
      // Standalone = buildings with no chain
      setStandalones(allBuildings.filter((b) => b.buildingChainId === null));
      setLoading(false);
    }
    load();
  }, [raceSlug]);

  const filteredChains = chains.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? c.category === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  const filteredStandalones = standalones.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? b.category === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const catChains = filteredChains.filter((c) => c.category === cat);
      const catStandalones = filteredStandalones.filter(
        (b) => b.category === cat,
      );
      if (catChains.length > 0 || catStandalones.length > 0) {
        acc[cat] = { chains: catChains, standalones: catStandalones };
      }
      return acc;
    },
    {} as Record<
      BuildingCategory,
      { chains: BuildingChainSummaryDTO[]; standalones: BuildingSummaryDTO[] }
    >,
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/buildings"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Buildings
        </Link>
        <span>›</span>
        <span className="text-text-primary">{raceName}</span>
      </div>

      <h1 className="text-3xl">{raceName} Buildings</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar placeholder="Search buildings..." onSearch={setSearch} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
                            font-display text-[0.65rem] tracking-widest uppercase
                            px-3 py-1.5 rounded-sm border transition-all duration-150
                            ${
                              selectedCategory === null
                                ? "bg-gold-subtle border-gold-bright text-gold-bright"
                                : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"
                            }
                        `}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(cat === selectedCategory ? null : cat)
              }
              className={`
                                font-display text-[0.65rem] tracking-widest uppercase
                                px-3 py-1.5 rounded-sm border transition-all duration-150
                                ${
                                  selectedCategory === cat
                                    ? "bg-gold-subtle border-gold-bright text-gold-bright"
                                    : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"
                                }
                            `}
            >
              {CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-text-muted italic">Loading buildings...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="text-text-muted italic">No buildings found.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(
            ([cat, { chains: catChains, standalones: catStandalones }]) => (
              <div key={cat}>
                <h2 className="text-sm font-display tracking-widest uppercase text-text-muted mb-3 border-b border-border-subtle pb-2">
                  {CATEGORY_LABEL[cat as BuildingCategory]}
                </h2>
                <div className="space-y-2">
                  {/* Chains */}
                  {catChains.map((chain) => (
                    <Link
                      key={chain.id}
                      href={`/buildings/${raceSlug}/${chain.slug}`}
                      className="
                                            group relative flex items-center gap-3
                                            bg-bg-surface border border-border-subtle rounded-md
                                            px-4 py-3 no-underline
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
                      <div className="flex-1">
                        <p
                          className="
                                                font-display text-sm font-semibold tracking-wide
                                                text-text-primary group-hover:text-gold-bright
                                                transition-colors duration-150
                                            "
                        >
                          {chain.name}
                        </p>
                      </div>
                      <Badge label="Chain" variant="gold" />
                    </Link>
                  ))}

                  {/* Standalone buildings */}
                  {catStandalones.map((building) => (
                    <Link
                      key={building.id}
                      href={`/buildings/${raceSlug}/${building.slug}`}
                      className="
                                            group relative flex items-center gap-3
                                            bg-bg-surface border border-border-subtle rounded-md
                                            px-4 py-3 no-underline
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
                      <div className="flex-1">
                        <p
                          className="
                                                font-display text-sm font-semibold tracking-wide
                                                text-text-primary group-hover:text-gold-bright
                                                transition-colors duration-150
                                            "
                        >
                          {building.name}
                        </p>
                      </div>
                      {building.tier && (
                        <span className="font-display text-xs text-text-muted tracking-widest uppercase">
                          Tier {TIER_LABEL[building.tier] ?? building.tier}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

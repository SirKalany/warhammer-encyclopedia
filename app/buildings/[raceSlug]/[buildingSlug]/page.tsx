"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { BuildingVariantDTO, RaceSummaryDTO } from "@/lib/types";
import { useVersion } from "@/lib/VersionContext";
import Badge from "@/components/common/Badge";
import Link from "next/link";

const TIER_LABEL: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
};

const CATEGORY_LABEL: Record<string, string> = {
  SETTLEMENT: "Settlement",
  PORT: "Port",
  MILITARY_RECRUITMENT: "Military Recruitment",
  MILITARY_SUPPORT: "Military Support",
  DEFENSE: "Defense",
  INFRASTRUCTURE: "Infrastructure",
  RESOURCE: "Resource",
  LANDMARK: "Landmark",
};

function BuildingCard({
  building,
  showTier = true,
}: {
  building: BuildingVariantDTO;
  showTier?: boolean;
}) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
      <div className="bg-bg-overlay px-4 py-3 border-b border-border-gold flex items-center gap-3">
        {building.picture && (
          <img
            src={building.picture}
            alt={building.name}
            className="w-10 h-10 object-contain flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h3 className="font-display text-sm font-semibold tracking-wide text-gold-bright">
            {building.name}
          </h3>
          {showTier && building.tier && (
            <span className="font-display text-xs text-text-muted tracking-widest uppercase">
              Tier {TIER_LABEL[building.tier] ?? building.tier}
            </span>
          )}
        </div>
        {building.cost && (
          <span className="font-display text-xs text-text-secondary tracking-wide">
            {building.cost} gold
          </span>
        )}
      </div>
      {building.effect && (
        <div className="px-4 py-3 text-text-secondary text-sm italic border-b border-border-subtle">
          {building.effect}
        </div>
      )}
      {building.requirements && (
        <div className="px-4 py-3 text-sm border-b border-border-subtle">
          <span className="font-display text-xs tracking-widest uppercase text-text-muted mr-2">
            Requirements:
          </span>
          <span className="text-text-secondary">{building.requirements}</span>
        </div>
      )}
    </div>
  );
}

export default function BuildingDetailPage() {
  const { raceSlug, buildingSlug } = useParams<{
    raceSlug: string;
    buildingSlug: string;
  }>();
  const { versionId } = useVersion();
  const [race, setRace] = useState<RaceSummaryDTO | null>(null);
  const [buildings, setBuildings] = useState<BuildingVariantDTO[]>([]);
  const [isChain, setIsChain] = useState(false);
  const [chainName, setChainName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const races = await api.raceVariants.findByVersion(versionId);
      const found = races.find((r) => r.slug === raceSlug);
      if (!found) return;
      setRace(found);

      // Chain slugs are prefixed with "chain-{id}"
      if (buildingSlug.startsWith("chain-")) {
        const chainId = Number(buildingSlug.replace("chain-", ""));
        const chainBuildings = await api.buildingVariants.findByVersion(
          versionId,
          found.id,
          chainId,
        );
        const sorted = chainBuildings.sort(
          (a, b) => (a.tier ?? 0) - (b.tier ?? 0),
        );
        // Fetch full DTOs for each building variant
        const full = await Promise.all(
          sorted.map((b) =>
            api.buildingVariants.findByBuildingAndVersion(
              b.buildingId,
              versionId,
            ),
          ),
        );
        setBuildings(full);
        setIsChain(true);
        // Get chain name from the identity layer
        const chain = await api.buildingChains.findBySlug(
          sorted[0]?.slug ?? "",
        );
        setChainName(chain?.name ?? "");
      } else {
        // Standalone building — find by slug
        const allBuildings = await api.buildings.findAll(found.id);
        const identity = allBuildings.find((b) => b.slug === buildingSlug);
        if (!identity) return;
        const variant = await api.buildingVariants.findByBuildingAndVersion(
          identity.id,
          versionId,
        );
        setBuildings([variant]);
        setIsChain(false);
      }
      setLoading(false);
    }
    load();
  }, [raceSlug, buildingSlug, versionId]);

  if (loading) return <p className="text-text-muted italic">Loading...</p>;
  if (buildings.length === 0)
    return (
      <p className="text-text-muted italic">
        Building not found for this version.
      </p>
    );

  const first = buildings[0];

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
        <Link
          href={`/buildings/${raceSlug}`}
          className="hover:text-gold-bright transition-colors duration-150"
        >
          {race?.name}
        </Link>
        <span>›</span>
        <span className="text-text-primary">
          {isChain ? chainName : first.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl">{isChain ? chainName : first.name}</h1>
        <Badge
          label={CATEGORY_LABEL[first.category] ?? first.category}
          variant="default"
        />
        {isChain && <Badge label="Chain" variant="gold" />}
        {!isChain && first.tier && (
          <Badge
            label={`Tier ${TIER_LABEL[first.tier] ?? first.tier}`}
            variant="default"
          />
        )}
      </div>

      {/* Chain progression */}
      {isChain ? (
        <div className="relative">
          {buildings.length > 1 && (
            <div className="absolute left-5 top-10 bottom-10 w-px bg-border-gold" />
          )}
          <div className="space-y-3">
            {buildings.map((building, index) => (
              <div key={building.id} className="flex gap-4 items-start">
                <div
                  className="
                                    w-10 h-10 flex-shrink-0 rounded-full
                                    bg-bg-overlay border border-border-gold
                                    flex items-center justify-center z-10
                                    font-display text-xs text-gold-bright font-bold
                                "
                >
                  {TIER_LABEL[building.tier ?? index + 1] ?? index + 1}
                </div>
                <div className="flex-1">
                  <BuildingCard building={building} showTier={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <BuildingCard building={first} />
        </div>
      )}
    </div>
  );
}

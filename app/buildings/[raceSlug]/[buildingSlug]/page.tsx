import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { BuildingDTO } from "@/lib/types";
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

interface Props {
  params: { raceSlug: string; buildingSlug: string };
}

function BuildingCard({
  building,
  showTier = true,
}: {
  building: BuildingDTO;
  showTier?: boolean;
}) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
      {/* Header */}
      <div className="bg-bg-overlay px-4 py-3 border-b border-border-gold flex items-center gap-3">
        {building.picture && (
          <img
            src={building.picture}
            alt={building.name}
            className="w-10 h-10 object-contain shrink-0"
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

      {/* Effect */}
      {building.effect && (
        <div className="px-4 py-3 text-text-secondary text-sm italic border-b border-border-subtle">
          {building.effect}
        </div>
      )}

      {/* Requirements */}
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

export default async function BuildingDetailPage({ params }: Props) {
  const races = await api.races.findAll();
  const race = races.find((r) => r.slug === params.raceSlug);
  if (!race) notFound();

  // Try chain first
  const chain = await api.buildingChains
    .findBySlug(params.buildingSlug)
    .catch(() => null);

  if (chain) {
    // Fetch all buildings in this chain
    const buildings = await api.buildings.findByChain(chain.id);
    const fullBuildings = await Promise.all(
      buildings.map((b) => api.buildings.findBySlug(b.slug)),
    );
    // Sort by tier
    const sorted = fullBuildings.sort((a, b) => (a.tier ?? 0) - (b.tier ?? 0));

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
            href={`/buildings/${params.raceSlug}`}
            className="hover:text-gold-bright transition-colors duration-150"
          >
            {race.name}
          </Link>
          <span>›</span>
          <span className="text-text-primary">{chain.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl">{chain.name}</h1>
          <Badge
            label={CATEGORY_LABEL[chain.category] ?? chain.category}
            variant="default"
          />
          <Badge label="Chain" variant="gold" />
        </div>

        {chain.description && (
          <p className="text-text-secondary italic">{chain.description}</p>
        )}

        {/* Tier progression */}
        <div className="relative">
          {/* Connector line */}
          {sorted.length > 1 && (
            <div className="absolute left-5 top-10 bottom-10 w-px bg-border-gold" />
          )}
          <div className="space-y-3">
            {sorted.map((building, index) => (
              <div key={building.id} className="flex gap-4 items-start">
                {/* Tier indicator */}
                <div
                  className="
                                    w-10 h-10 shrink-0 rounded-full
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
      </div>
    );
  }

  // Fallback — standalone building
  const building = await api.buildings
    .findBySlug(params.buildingSlug)
    .catch(() => null);
  if (!building) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
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
          href={`/buildings/${params.raceSlug}`}
          className="hover:text-gold-bright transition-colors duration-150"
        >
          {race.name}
        </Link>
        <span>›</span>
        <span className="text-text-primary">{building.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl">{building.name}</h1>
        <Badge
          label={CATEGORY_LABEL[building.category] ?? building.category}
          variant="default"
        />
        {building.tier && (
          <Badge
            label={`Tier ${TIER_LABEL[building.tier] ?? building.tier}`}
            variant="default"
          />
        )}
      </div>

      <BuildingCard building={building} />
    </div>
  );
}

import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import Badge from "@/components/common/Badge";
import Link from "next/link";

const CLIMATE_LABELS: Record<string, string> = {
  climateChaoticWasteland: "Chaotic Wasteland",
  climateFrozen: "Frozen",
  climateMountain: "Mountain",
  climateTemperate: "Temperate",
  climateTemperateIsland: "Temperate Island",
  climateMagicalForest: "Magical Forest",
  climateJungle: "Jungle",
  climateSavannah: "Savannah",
  climateDesert: "Desert",
  climateWasteland: "Wasteland",
  climateOcean: "Ocean",
};

const CLIMATE_VARIANT: Record<string, "good" | "warn" | "bad"> = {
  HABITABLE: "good",
  UNPLEASANT: "warn",
  UNINHABITABLE: "bad",
};

interface Props {
  params: { raceSlug: string };
}

export default async function FactionsByRacePage({ params }: Props) {
  const races = await api.races.findAll();
  const race = races.find((r) => r.slug === params.raceSlug);
  if (!race) notFound();

  // Fetch summaries first, then full DTO for each faction
  const summaries = await api.factions.findByRace(race.id);
  const factions = await Promise.all(
    summaries.map((s) => api.factions.findBySlug(s.slug)),
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/factions"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Factions
        </Link>
        <span>›</span>
        <span className="text-text-primary">{race.name}</span>
      </div>

      <h1 className="text-3xl">{race.name}</h1>

      {factions.length === 0 ? (
        <p className="text-text-muted italic">
          No factions found for this race.
        </p>
      ) : (
        <div className="space-y-4">
          {factions.map((faction) => (
            <div
              key={faction.id}
              className="bg-bg-surface border border-border-subtle rounded-md p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                {faction.banner && (
                  <img
                    src={faction.banner}
                    alt={faction.name}
                    className="w-12 h-12 object-contain shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl">{faction.name}</h2>
                    {faction.isHorde && <Badge label="Horde" variant="warn" />}
                  </div>
                  {faction.leader && (
                    <p className="text-text-secondary text-sm">
                      Led by{" "}
                      <span className="text-gold-bright">{faction.leader}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Faction effect */}
              {faction.factionEffect && (
                <div
                  className="
                                    bg-bg-raised border border-border-subtle rounded-md
                                    px-4 py-3 text-text-secondary text-sm italic
                                "
                >
                  {faction.factionEffect}
                </div>
              )}

              {/* Climates */}
              <div>
                <h3 className="text-xs font-display tracking-widest uppercase text-text-muted mb-2">
                  Climates
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CLIMATE_LABELS).map(([key, label]) => {
                    const status = faction[
                      key as keyof typeof faction
                    ] as string;
                    return (
                      <div key={key} className="flex items-center gap-1.5">
                        <span className="text-text-muted text-xs">{label}</span>
                        <Badge
                          label={status}
                          variant={CLIMATE_VARIANT[status] ?? "default"}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

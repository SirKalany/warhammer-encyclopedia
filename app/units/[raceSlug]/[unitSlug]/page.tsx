"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { UnitVariantDTO, RaceSummaryDTO } from "@/lib/types";
import { useVersion } from "@/lib/VersionContext";
import UnitDetail from "@/components/units/UnitDetail";
import Link from "next/link";

export default function UnitDetailPage() {
  const { raceSlug, unitSlug } = useParams<{
    raceSlug: string;
    unitSlug: string;
  }>();
  const { versionId } = useVersion();
  const [unit, setUnit] = useState<UnitVariantDTO | null>(null);
  const [race, setRace] = useState<RaceSummaryDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const races = await api.raceVariants.findByVersion(versionId);
      const foundRace = races.find((r) => r.slug === raceSlug);
      if (!foundRace) return;
      setRace(foundRace);

      // Get unit identity by slug, then fetch its variant
      const units = await api.units.findAll();
      const foundUnit = units.find((u) => u.slug === unitSlug);
      if (!foundUnit) return;

      const variant = await api.unitVariants.findByUnitAndVersion(
        foundUnit.id,
        versionId,
      );
      setUnit(variant);
      setLoading(false);
    }
    load();
  }, [raceSlug, unitSlug, versionId]);

  if (loading) return <p className="text-text-muted italic">Loading...</p>;
  if (!unit)
    return (
      <p className="text-text-muted italic">Unit not found for this version.</p>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/units"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Units
        </Link>
        <span>›</span>
        <Link
          href={`/units/${raceSlug}`}
          className="hover:text-gold-bright transition-colors duration-150"
        >
          {race?.name}
        </Link>
        <span>›</span>
        <span className="text-text-primary">{unit.name}</span>
      </div>
      <UnitDetail unit={unit} />
    </div>
  );
}

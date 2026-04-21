import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import UnitDetail from "@/components/units/UnitDetail";
import Link from "next/link";

interface Props {
  params: { raceSlug: string; unitSlug: string };
}

export default async function UnitDetailPage({ params }: Props) {
  const races = await api.races.findAll();
  const race = races.find((r) => r.slug === params.raceSlug);
  if (!race) notFound();

  const unit = await api.units.findBySlug(params.unitSlug).catch(() => null);
  if (!unit) notFound();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/units"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Units
        </Link>
        <span>›</span>
        <Link
          href={`/units/${params.raceSlug}`}
          className="hover:text-gold-bright transition-colors duration-150"
        >
          {race.name}
        </Link>
        <span>›</span>
        <span className="text-text-primary">{unit.name}</span>
      </div>

      <UnitDetail unit={unit} />
    </div>
  );
}

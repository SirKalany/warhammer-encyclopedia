import Link from "next/link";
import { UnitVariantSummaryDTO } from "@/lib/types";
import Badge from "@/components/common/Badge";

interface UnitCardProps {
  unit: UnitVariantSummaryDTO;
  raceSlug: string;
}

const TIER_LABEL: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
};

const CATEGORY_TYPE_VARIANT: Record<
  string,
  "default" | "gold" | "good" | "warn" | "bad"
> = {
  REGULAR: "default",
  LEGENDARY: "gold",
  LANDMARK: "warn",
  RENOWNED: "good",
  RAISED: "bad",
};

export default function UnitCard({ unit, raceSlug }: UnitCardProps) {
  return (
    <Link
      href={`/units/${raceSlug}/${unit.slug}`}
      className="
                group relative flex items-center gap-4
                bg-bg-surface border border-border-subtle rounded-md
                p-3 no-underline
                hover:border-gold-dim hover:bg-bg-raised
                transition-all duration-150
            "
    >
      <div
        className="
                w-14 h-14 flex-shrink-0 rounded-sm overflow-hidden
                bg-bg-overlay border border-border-subtle
                flex items-center justify-center
            "
      >
        {unit.picture ? (
          <img
            src={unit.picture}
            alt={unit.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-text-muted text-xl">⚔</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display text-[0.6rem] font-bold tracking-widest text-text-muted uppercase">
            Tier {TIER_LABEL[unit.tier] ?? unit.tier}
          </span>
          <Badge
            label={unit.categoryType}
            variant={CATEGORY_TYPE_VARIANT[unit.categoryType] ?? "default"}
          />
        </div>
        <p
          className="
                    font-display text-sm font-semibold tracking-wide
                    text-text-primary group-hover:text-gold-bright
                    transition-colors duration-150 truncate
                "
        >
          {unit.name}
        </p>
        {unit.category && (
          <p className="text-text-muted text-xs mt-0.5 truncate">
            {unit.category}
          </p>
        )}
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="font-display text-[0.6rem] tracking-widest text-text-muted uppercase">
          {unit.role.replace(/_/g, " ")}
        </span>
      </div>

      <div
        className="
                absolute left-0 top-0 bottom-0 w-0.5 rounded-l-md
                bg-gold-bright opacity-0 group-hover:opacity-100
                transition-opacity duration-150
            "
      />
    </Link>
  );
}

import { SpellSummaryDTO } from "@/lib/types";
import Badge from "@/components/common/Badge";
import Link from "next/link";

interface SpellCardProps {
  spell: SpellSummaryDTO;
}

const TYPE_VARIANT: Record<
  string,
  "default" | "gold" | "good" | "warn" | "bad"
> = {
  AUGMENT: "good",
  REGENERATION: "good",
  HEX: "bad",
  MAGIC_MISSILE: "warn",
  WIND: "warn",
  BREATH: "warn",
  DIRECT_DAMAGE: "bad",
  BOMBARDMENT: "bad",
  EXPLOSION: "bad",
  HIDING: "default",
  VORTEX: "bad",
  SUMMON: "gold",
};

export default function SpellCard({ spell }: SpellCardProps) {
  return (
    <Link
      href={`/spells/${spell.slug}`}
      className="
                flex items-center justify-between gap-3
                bg-bg-surface border border-border-subtle rounded-md
                px-4 py-3 no-underline
                hover:border-gold-dim hover:bg-bg-raised
                transition-all duration-150 group
            "
    >
      <span
        className="
                font-display text-sm font-semibold tracking-wide
                text-text-primary group-hover:text-gold-bright
                transition-colors duration-150
            "
      >
        {spell.name}
      </span>
      <Badge
        label={spell.type.replace(/_/g, " ")}
        variant={TYPE_VARIANT[spell.type] ?? "default"}
      />
    </Link>
  );
}

import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import OvercastToggle from "@/components/spells/OvercastToggle";
import Badge from "@/components/common/Badge";
import Link from "next/link";

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

interface Props {
  params: { loreSlug: string; spellSlug: string };
}

export default async function SpellDetailPage({ params }: Props) {
  const lores = await api.lores.findAll();
  const lore = lores.find((l) => l.slug === params.loreSlug);
  if (!lore) notFound();

  const spell = await api.spells.findBySlug(params.spellSlug).catch(() => null);
  if (!spell) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/spells"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Spells
        </Link>
        <span>›</span>
        <Link
          href={`/spells/${params.loreSlug}`}
          className="hover:text-gold-bright transition-colors duration-150"
        >
          {lore.name}
        </Link>
        <span>›</span>
        <span className="text-text-primary">{spell.name}</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <Badge
          label={spell.type.replace(/_/g, " ")}
          variant={TYPE_VARIANT[spell.type] ?? "default"}
        />
        <h1 className="text-3xl">{spell.name}</h1>
      </div>

      {/* Overcast toggle + stats */}
      <OvercastToggle spell={spell} />

      {/* Conditions */}
      {spell.conditions && (
        <div className="bg-bg-surface border border-border-subtle rounded-md px-4 py-3 text-sm text-text-secondary">
          <span className="text-text-muted font-display text-xs tracking-widest uppercase mr-2">
            Conditions:
          </span>
          {spell.conditions}
        </div>
      )}
    </div>
  );
}

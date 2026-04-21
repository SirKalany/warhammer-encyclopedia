import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import Badge from "@/components/common/Badge";
import Link from "next/link";

const RARITY_VARIANT: Record<
  string,
  "default" | "gold" | "good" | "warn" | "bad"
> = {
  COMMON: "default",
  UNCOMMON: "good",
  RARE: "warn",
  LEGENDARY: "gold",
  CRAFTED: "bad",
};

const CATEGORY_LABEL: Record<string, string> = {
  ARMOUR: "Armour",
  ENCHANTED_ITEM: "Enchanted Item",
  TALISMAN: "Talisman",
  WEAPON: "Weapon",
  ARCANE_ITEM: "Arcane Item",
};

interface Props {
  params: { id: string };
}

export default async function ItemDetailPage({ params }: Props) {
  const item = await api.items.findBySlug(params.id).catch(() => null);
  if (!item) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/items"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Items
        </Link>
        <span>›</span>
        <span className="text-text-primary">{item.name}</span>
      </div>

      {/* Header */}
      <div className="flex gap-5 items-start">
        {item.picture && (
          <img
            src={item.picture}
            alt={item.name}
            className="w-20 h-20 object-contain shrink-0 border border-border-gold rounded-md p-1"
          />
        )}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              label={item.rarity}
              variant={RARITY_VARIANT[item.rarity] ?? "default"}
            />
            <Badge
              label={CATEGORY_LABEL[item.category] ?? item.category}
              variant="default"
            />
            {item.raceId && <Badge label="Race Restricted" variant="warn" />}
          </div>
          <h1 className="text-3xl">{item.name}</h1>
        </div>
      </div>

      {/* Effect */}
      {item.effect && (
        <div
          className="
                    bg-bg-surface border border-border-subtle rounded-md
                    px-5 py-4 italic text-text-secondary font-body leading-relaxed
                "
        >
          {item.effect}
        </div>
      )}

      {/* Granted abilities */}
      {item.abilityIds.length > 0 && (
        <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
          <div className="bg-bg-overlay px-4 py-2 border-b border-border-gold">
            <h3 className="font-display text-xs font-bold tracking-widest uppercase text-gold-bright">
              Granted Abilities
            </h3>
          </div>
          <div className="px-4 py-3 text-text-muted text-sm italic">
            {item.abilityIds.length}{" "}
            {item.abilityIds.length === 1 ? "ability" : "abilities"} granted
          </div>
        </div>
      )}

      {/* Granted spells */}
      {item.spellIds.length > 0 && (
        <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
          <div className="bg-bg-overlay px-4 py-2 border-b border-border-gold">
            <h3 className="font-display text-xs font-bold tracking-widest uppercase text-gold-bright">
              Granted Spells
            </h3>
          </div>
          <div className="px-4 py-3 text-text-muted text-sm italic">
            {item.spellIds.length}{" "}
            {item.spellIds.length === 1 ? "spell" : "spells"} granted
          </div>
        </div>
      )}
    </div>
  );
}

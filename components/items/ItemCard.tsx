import Link from "next/link";
import { ItemSummaryDTO } from "@/lib/types";
import Badge from "@/components/common/Badge";

interface ItemCardProps {
  item: ItemSummaryDTO;
}

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

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      href={`/items/${item.slug}`}
      className="
                group relative flex items-center gap-4
                bg-bg-surface border border-border-subtle rounded-md
                p-3 no-underline
                hover:border-gold-dim hover:bg-bg-raised
                transition-all duration-150
            "
    >
      {/* Left accent */}
      <div
        className="
                absolute left-0 top-0 bottom-0 w-0.5 rounded-l-md
                bg-gold-bright opacity-0 group-hover:opacity-100
                transition-opacity duration-150
            "
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge
            label={item.rarity}
            variant={RARITY_VARIANT[item.rarity] ?? "default"}
          />
          <Badge
            label={CATEGORY_LABEL[item.category] ?? item.category}
            variant="default"
          />
        </div>

        <p
          className="
                    font-display text-sm font-semibold tracking-wide
                    text-text-primary group-hover:text-gold-bright
                    transition-colors duration-150 truncate
                "
        >
          {item.name}
        </p>
      </div>

      {/* Race restriction */}
      {item.raceId && (
        <div className="shrink-0">
          <Badge label="Race Restricted" variant="warn" />
        </div>
      )}
    </Link>
  );
}

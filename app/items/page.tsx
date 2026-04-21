"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ItemSummaryDTO, ItemCategory } from "@/lib/types";
import ItemCard from "@/components/items/ItemCard";
import SearchBar from "@/components/common/SearchBar";

const CATEGORIES: ItemCategory[] = [
  "ARMOUR",
  "ENCHANTED_ITEM",
  "TALISMAN",
  "WEAPON",
  "ARCANE_ITEM",
];

const CATEGORY_LABEL: Record<ItemCategory, string> = {
  ARMOUR: "Armour",
  ENCHANTED_ITEM: "Enchanted Item",
  TALISMAN: "Talisman",
  WEAPON: "Weapon",
  ARCANE_ITEM: "Arcane Item",
};

export default function ItemsPage() {
  const [items, setItems] = useState<ItemSummaryDTO[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.items.findAll().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? i.category === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Items</h1>
        <p className="text-text-secondary italic">
          Browse all magical items and artifacts.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar placeholder="Search items..." onSearch={setSearch} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
                            font-display text-[0.65rem] tracking-widest uppercase
                            px-3 py-1.5 rounded-sm border transition-all duration-150
                            ${
                              selectedCategory === null
                                ? "bg-gold-subtle border-gold-bright text-gold-bright"
                                : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"
                            }
                        `}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(cat === selectedCategory ? null : cat)
              }
              className={`
                                font-display text-[0.65rem] tracking-widest uppercase
                                px-3 py-1.5 rounded-sm border transition-all duration-150
                                ${
                                  selectedCategory === cat
                                    ? "bg-gold-subtle border-gold-bright text-gold-bright"
                                    : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"
                                }
                            `}
            >
              {CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-text-muted italic">Loading items...</p>
      ) : filtered.length === 0 ? (
        <p className="text-text-muted italic">No items found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

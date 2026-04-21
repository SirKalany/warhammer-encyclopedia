import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import SpellCard from "@/components/spells/SpellCard";
import Link from "next/link";

interface Props {
  params: { loreSlug: string };
}

export default async function LoreSpellsPage({ params }: Props) {
  const lore = await api.lores.findBySlug(params.loreSlug).catch(() => null);
  if (!lore) notFound();

  const spells = await api.spells.findByLore(lore.id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/spells"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Spells
        </Link>
        <span>›</span>
        <span className="text-text-primary">{lore.name}</span>
      </div>

      <div>
        <h1 className="text-3xl mb-2">{lore.name}</h1>
        {lore.description && (
          <p className="text-text-secondary italic">{lore.description}</p>
        )}
      </div>

      {spells.length === 0 ? (
        <p className="text-text-muted italic">No spells found for this lore.</p>
      ) : (
        <div className="space-y-2">
          {spells.map((spell) => (
            <SpellCard key={spell.id} spell={spell} />
          ))}
        </div>
      )}
    </div>
  );
}

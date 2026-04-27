import Link from "next/link";

const SECTIONS = [
  {
    href: "/factions",
    label: "Factions",
    description: "Browse all races and their factions across the world.",
    icon: "⚑",
  },
  {
    href: "/units",
    label: "Units",
    description: "Explore full unit rosters with detailed statistics and abilities.",
    icon: "⚔",
  },
  {
    href: "/buildings",
    label: "Buildings",
    description: "Discover building chains, landmarks and their effects.",
    icon: "🏰",
  },
  {
    href: "/abilities",
    label: "Abilities",
    description: "Reference every active and passive ability in the game.",
    icon: "✦",
  },
  {
    href: "/spells",
    label: "Spells",
    description: "Browse lores of magic and their spells.",
    icon: "✧",
  },
  {
    href: "/items",
    label: "Items",
    description: "Find weapons, armour, talismans and arcane items for your lords.",
    icon: "◈",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 py-12">
        <p className="font-display text-xs tracking-[0.3em] uppercase text-gold-mid">
          Total War: Warhammer III
        </p>
        <h1 className="text-5xl font-display font-bold text-gold-bright">
          WHEncyclopedia
        </h1>
        <p className="text-text-secondary font-body text-lg max-w-xl mx-auto italic">
          A complete reference for units, factions, buildings, spells and more.
        </p>
        <div className="w-24 h-px bg-gold-dim mx-auto mt-4" />
      </div>

      {/* Sections grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="
                            group relative bg-bg-surface border border-border-subtle
                            rounded-md p-6 no-underline overflow-hidden
                            hover:border-gold-dim hover:bg-bg-raised
                            transition-all duration-150
                        "
          >
            {/* Gold left border on hover */}
            <div
              className="
                            absolute left-0 top-0 bottom-0 w-0.5
                            bg-gold-bright opacity-0 group-hover:opacity-100
                            transition-opacity duration-150
                        "
            />

            <div className="text-3xl mb-3 text-gold-dim group-hover:text-gold-bright transition-colors duration-150">
              {section.icon}
            </div>

            <h2 className="text-lg mb-2 group-hover:text-gold-bright transition-colors duration-150">
              {section.label}
            </h2>

            <p className="text-text-muted text-sm font-body leading-relaxed">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

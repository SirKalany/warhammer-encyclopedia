import Link from "next/link";

const SECTIONS = [
  { href: "/admin/races", label: "Races", icon: "⚑" },
  { href: "/admin/factions", label: "Factions", icon: "⚔" },
  { href: "/admin/units", label: "Units", icon: "🗡" },
  { href: "/admin/buildings", label: "Buildings", icon: "🏰" },
  { href: "/admin/building-chains", label: "Building Chains", icon: "🔗" },
  { href: "/admin/abilities", label: "Abilities", icon: "✦" },
  { href: "/admin/spells", label: "Spells", icon: "✧" },
  { href: "/admin/lores", label: "Lores of Magic", icon: "📖" },
  { href: "/admin/items", label: "Items", icon: "◈" },
  { href: "/admin/imbuements", label: "Imbuements", icon: "⚗" },
  { href: "/admin/unit-attributes", label: "Unit Attributes", icon: "📋" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-display text-xs tracking-widest uppercase text-gold-mid mb-2">
          Administration
        </p>
        <h1 className="text-3xl">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="
                            group relative bg-bg-surface border border-border-subtle
                            rounded-md p-5 no-underline
                            hover:border-gold-dim hover:bg-bg-raised
                            transition-all duration-150
                        "
          >
            <div
              className="
                            absolute left-0 top-0 bottom-0 w-0.5 rounded-l-md
                            bg-gold-bright opacity-0 group-hover:opacity-100
                            transition-opacity duration-150
                        "
            />
            <div className="text-2xl mb-2 text-gold-dim group-hover:text-gold-bright transition-colors duration-150">
              {section.icon}
            </div>
            <h2 className="text-sm group-hover:text-gold-bright transition-colors duration-150">
              {section.label}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

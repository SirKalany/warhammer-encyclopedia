"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Factions", href: "/factions" },
  { label: "Units", href: "/units" },
  { label: "Buildings", href: "/buildings" },
  { label: "Abilities", href: "/abilities" },
  { label: "Spells", href: "/spells" },
  { label: "Items", href: "/items" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-100 bg-bg-surface border-b border-border-gold backdrop-blur-sm">
      <div className="max-w-350 mx-auto px-8 h-15 flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 no-underline"
        >
          <span className="text-gold-bright text-xl">⚔</span>
          <span className="font-display text-sm font-bold tracking-widest text-gold-bright uppercase">
            WHEncyclopedia
          </span>
        </Link>

        <nav className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                                    font-display text-[0.7rem] font-semibold tracking-widest uppercase
                                    px-3 py-1.5 rounded-sm transition-all duration-150 no-underline
                                    ${
                                      isActive
                                        ? "text-gold-bright bg-gold-subtle border-b-2 border-gold-bright"
                                        : "text-text-secondary hover:text-gold-bright hover:bg-gold-subtle"
                                    }
                                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/admin"
          className="
                        font-display text-[0.7rem] font-semibold tracking-widest uppercase
                        text-text-muted px-3 py-1.5 border border-border-gold rounded-sm
                        transition-all duration-150 no-underline shrink-0
                        hover:text-gold-bright hover:border-gold-mid hover:bg-gold-subtle
                    "
        >
          Admin
        </Link>
      </div>
    </header>
  );
}

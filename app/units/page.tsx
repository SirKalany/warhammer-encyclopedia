import { api } from "@/lib/api";
import Link from "next/link";

export default async function UnitsPage() {
  const races = await api.races.findAll();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl mb-2">Units</h1>
        <p className="text-text-secondary italic">
          Select a race to browse its unit roster.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map((race) => (
          <Link
            key={race.id}
            href={`/units/${race.slug}`}
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
            <h2 className="text-base group-hover:text-gold-bright transition-colors duration-150">
              {race.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

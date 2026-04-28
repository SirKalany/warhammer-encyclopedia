"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { AbilityVariantDTO } from "@/lib/types";
import { useVersion } from "@/lib/VersionContext";
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

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border-subtle last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="font-display text-sm font-semibold tracking-wide text-text-primary">
        {value}
      </span>
    </div>
  );
}

export default function AbilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { versionId } = useVersion();
  const [ability, setAbility] = useState<AbilityVariantDTO | null>(null);

  useEffect(() => {
    api.abilityVariants
      .findByAbilityAndVersion(Number(id), versionId)
      .then(setAbility)
      .catch(() => setAbility(null));
  }, [id, versionId]);

  if (!ability)
    return (
      <p className="text-text-muted italic">
        Ability not found for this version.
      </p>
    );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link
          href="/abilities"
          className="hover:text-gold-bright transition-colors duration-150"
        >
          Abilities
        </Link>
        <span>›</span>
        <span className="text-text-primary">{ability.name}</span>
      </div>

      <div className="space-y-2">
        <Badge
          label={ability.type.replace(/_/g, " ")}
          variant={TYPE_VARIANT[ability.type] ?? "default"}
        />
        <h1 className="text-3xl">{ability.name}</h1>
      </div>

      {ability.effect && (
        <div className="bg-bg-surface border border-border-subtle rounded-md px-5 py-4 italic text-text-secondary font-body leading-relaxed">
          {ability.effect}
        </div>
      )}

      <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
        <div className="bg-bg-overlay px-4 py-2 border-b border-border-gold">
          <h3 className="font-display text-xs font-bold tracking-widest uppercase text-gold-bright">
            Statistics
          </h3>
        </div>
        <div className="px-4 py-1">
          <StatRow label="Target" value={ability.target} />
          <StatRow label="Range" value={ability.range} />
          <StatRow label="Radius" value={ability.radius} />
          <StatRow label="Duration" value={ability.duration} />
          <StatRow label="Cooldown" value={ability.cooldown} />
          <StatRow label="Affected Units" value={ability.affectedUnits} />
          <StatRow label="Uses" value={ability.uses} />
          <StatRow label="Conditions" value={ability.conditions} />
          <StatRow label="Base Damage" value={ability.baseDamage} />
          <StatRow label="Explosive Damage" value={ability.explosiveDamage} />
          <StatRow label="Damage per Second" value={ability.damagePerSecond} />
          <StatRow label="Movement Speed" value={ability.movementSpeed} />
        </div>
      </div>
    </div>
  );
}

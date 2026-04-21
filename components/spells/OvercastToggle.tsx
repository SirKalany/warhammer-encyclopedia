"use client";

import { useState } from "react";
import { SpellDTO } from "@/lib/types";

interface OvercastToggleProps {
  spell: SpellDTO;
}

interface StatRowProps {
  label: string;
  base: string | number | null | undefined;
  overcast: string | number | null | undefined;
  isOvercast: boolean;
}

function StatRow({ label, base, overcast, isOvercast }: StatRowProps) {
  const value =
    isOvercast && overcast !== null && overcast !== undefined ? overcast : base;
  const changed =
    overcast !== null && overcast !== undefined && overcast !== base;

  if (value === null || value === undefined) return null;

  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border-subtle last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span
        className={`
                font-display text-sm font-semibold tracking-wide
                ${isOvercast && changed ? "text-gold-bright" : "text-text-primary"}
            `}
      >
        {value}
        {isOvercast && changed && (
          <span className="text-text-muted text-xs ml-1 line-through">
            {base}
          </span>
        )}
      </span>
    </div>
  );
}

export default function OvercastToggle({ spell }: OvercastToggleProps) {
  const [isOvercast, setIsOvercast] = useState(false);
  const hasOvercast =
    spell.overcastCost !== null || spell.overcastEffect !== null;

  return (
    <div className="space-y-4">
      {/* Toggle */}
      {hasOvercast && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOvercast(false)}
            className={`
                            font-display text-xs font-semibold tracking-widest uppercase
                            px-4 py-1.5 rounded-sm border transition-all duration-150
                            ${
                              !isOvercast
                                ? "bg-gold-subtle border-gold-bright text-gold-bright"
                                : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"
                            }
                        `}
          >
            Base
          </button>
          <button
            onClick={() => setIsOvercast(true)}
            className={`
                            font-display text-xs font-semibold tracking-widest uppercase
                            px-4 py-1.5 rounded-sm border transition-all duration-150
                            ${
                              isOvercast
                                ? "bg-gold-subtle border-gold-bright text-gold-bright"
                                : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"
                            }
                        `}
          >
            Overcast
          </button>
        </div>
      )}

      {/* Effect text */}
      {(isOvercast ? (spell.overcastEffect ?? spell.effect) : spell.effect) && (
        <div
          className="
                    bg-bg-surface border border-border-subtle rounded-md
                    px-5 py-4 italic text-text-secondary font-body leading-relaxed
                "
        >
          {isOvercast ? (spell.overcastEffect ?? spell.effect) : spell.effect}
        </div>
      )}

      {/* Stats */}
      <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
        <div className="bg-bg-overlay px-4 py-2 border-b border-border-gold">
          <h3 className="font-display text-xs font-bold tracking-widest uppercase text-gold-bright">
            Spell Statistics
          </h3>
        </div>
        <div className="px-4 py-1">
          <StatRow
            label="Cost"
            base={spell.cost}
            overcast={spell.overcastCost}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Miscast Chance"
            base={spell.miscastChance}
            overcast={spell.overcastMiscastChance}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Target"
            base={spell.target}
            overcast={spell.overcastTarget}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Range"
            base={spell.range}
            overcast={spell.overcastRange}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Radius"
            base={spell.radius}
            overcast={spell.overcastRadius}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Duration"
            base={spell.duration}
            overcast={spell.overcastDuration}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Cooldown"
            base={spell.cooldown}
            overcast={spell.overcastCooldown}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Affected Units"
            base={spell.affectedUnits}
            overcast={spell.overcastAffectedUnits}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Base Damage"
            base={spell.baseDamage}
            overcast={spell.overcastBaseDamage}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Explosive Damage"
            base={spell.explosiveDamage}
            overcast={spell.overcastExplosiveDamage}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Damage per Second"
            base={spell.damagePerSecond}
            overcast={spell.overcastDamagePerSecond}
            isOvercast={isOvercast}
          />
          <StatRow
            label="Movement Speed"
            base={spell.movementSpeed}
            overcast={spell.overcastMovementSpeed}
            isOvercast={isOvercast}
          />
        </div>
      </div>
    </div>
  );
}

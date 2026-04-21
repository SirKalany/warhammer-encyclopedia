import { UnitDTO } from "@/lib/types";
import UnitStatBlock from "./UnitStatBlock";
import Badge from "@/components/common/Badge";
import AbilityCard from "@/components/abilities/AbilityCard";
import SpellCard from "@/components/spells/SpellCard";

const CATEGORY_TYPE_VARIANT: Record<
  string,
  "default" | "gold" | "good" | "warn" | "bad"
> = {
  REGULAR: "default",
  LEGENDARY: "gold",
  LANDMARK: "warn",
  RENOWNED: "good",
  RAISED: "bad",
};

const TIER_LABEL: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
};

interface UnitDetailProps {
  unit: UnitDTO;
}

export default function UnitDetail({ unit }: UnitDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex gap-6 items-start">
        {/* Picture */}
        <div
          className="
                    w-32 h-32 shrink-0 rounded-md overflow-hidden
                    bg-bg-overlay border border-border-gold
                    flex items-center justify-center
                "
        >
          {unit.picture ? (
            <img
              src={unit.picture}
              alt={unit.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-text-muted text-4xl">⚔</span>
          )}
        </div>

        {/* Title block */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              label={`Tier ${TIER_LABEL[unit.tier] ?? unit.tier}`}
              variant="default"
            />
            <Badge
              label={unit.categoryType}
              variant={CATEGORY_TYPE_VARIANT[unit.categoryType] ?? "default"}
            />
            <Badge label={unit.role.replace(/_/g, " ")} variant="default" />
          </div>

          <h1 className="text-3xl mb-1">{unit.name}</h1>

          {unit.category && (
            <p className="text-text-secondary font-body text-lg italic">
              {unit.category}
            </p>
          )}

          {/* Attribute lines */}
          {unit.attributeLines.length > 0 && (
            <div className="mt-3 space-y-1">
              {unit.attributeLines.map((line) => (
                <p key={line.id} className="text-text-secondary text-sm">
                  {line.content}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {unit.description && (
        <div
          className="
                    bg-bg-surface border border-border-subtle rounded-md
                    px-5 py-4 italic text-text-secondary font-body leading-relaxed
                "
        >
          {unit.description}
        </div>
      )}

      {/* Unit Attributes (Flying, Daemonic etc.) */}
      {unit.unitAttributes.length > 0 && (
        <div>
          <h2 className="text-base mb-3">Unit Attributes</h2>
          <div className="flex flex-wrap gap-2">
            {unit.unitAttributes.map((attr) => (
              <Badge key={attr.id} label={attr.name} variant="default" />
            ))}
          </div>
        </div>
      )}

      {/* Building requirements */}
      {(unit.unlockBuildingId || unit.allowBuildingId) && (
        <div
          className="
                    bg-bg-surface border border-border-subtle rounded-md px-5 py-3
                    flex flex-wrap gap-4 text-sm
                "
        >
          {unit.unlockBuildingId && (
            <span className="text-text-secondary">
              Unlocked by building{" "}
              <span className="text-gold-bright">#{unit.unlockBuildingId}</span>
            </span>
          )}
          {unit.allowBuildingId && (
            <span className="text-text-secondary">
              Allowed by building{" "}
              <span className="text-gold-bright">#{unit.allowBuildingId}</span>
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div>
        <h2 className="text-base mb-3">Statistics</h2>
        <UnitStatBlock unit={unit} />
      </div>

      {/* Active Abilities */}
      {unit.abilities.length > 0 && (
        <div>
          <h2 className="text-base mb-3">Active Abilities</h2>
          <div className="space-y-2">
            {unit.abilities.map((ability) => (
              <AbilityCard key={ability.id} ability={ability} />
            ))}
          </div>
        </div>
      )}

      {/* Passive Abilities */}
      {unit.passiveAbilities.length > 0 && (
        <div>
          <h2 className="text-base mb-3">Passive Abilities</h2>
          <div className="space-y-2">
            {unit.passiveAbilities.map((ability) => (
              <AbilityCard key={ability.id} ability={ability} />
            ))}
          </div>
        </div>
      )}

      {/* Spells */}
      {unit.spells.length > 0 && (
        <div>
          <h2 className="text-base mb-3">Spells</h2>
          <div className="space-y-2">
            {unit.spells.map((spell) => (
              <SpellCard key={spell.id} spell={spell} />
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      {unit.items.length > 0 && (
        <div>
          <h2 className="text-base mb-3">Restricted Items</h2>
          <div className="flex flex-wrap gap-2">
            {unit.items.map((item) => (
              <Badge key={item.id} label={item.name} variant="gold" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

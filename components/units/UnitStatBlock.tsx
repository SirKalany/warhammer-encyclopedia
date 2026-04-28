import { UnitVariantDTO } from "@/lib/types";

interface StatRowProps {
  label: string;
  value: string | number | null | undefined;
  highlight?: boolean;
  indent?: boolean;
}

function StatRow({
  label,
  value,
  highlight = false,
  indent = false,
}: StatRowProps) {
  if (value === null || value === undefined) return null;
  return (
    <div
      className={`
            flex justify-between items-center
            py-1.5 border-b border-border-subtle last:border-0
            ${indent ? "pl-4" : ""}
        `}
    >
      <span
        className={`text-sm ${indent ? "text-text-muted" : "text-text-secondary"}`}
      >
        {label}
      </span>
      <span
        className={`
                font-display text-sm font-semibold tracking-wide
                ${highlight ? "text-gold-bright" : "text-text-primary"}
            `}
      >
        {value}
      </span>
    </div>
  );
}

interface StatSectionProps {
  title: string;
  children: React.ReactNode;
}

function StatSection({ title, children }: StatSectionProps) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
      <div className="bg-bg-overlay px-4 py-2 border-b border-border-gold">
        <h3 className="font-display text-xs font-bold tracking-widest uppercase text-gold-bright">
          {title}
        </h3>
      </div>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
}

function pct(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return `${value}%`;
}

interface UnitStatBlockProps {
  unit: UnitVariantDTO;
}

export default function UnitStatBlock({ unit }: UnitStatBlockProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Overview */}
      <StatSection title="Overview">
        <StatRow label="Size" value={unit.size} />
        <StatRow label="Entities" value={unit.entities} />
        <StatRow label="Mass" value={unit.mass} />
        <StatRow label="Campaign Cost" value={unit.campaignCost} highlight />
        <StatRow label="Base Upkeep" value={unit.baseUpkeep} indent />
        <StatRow
          label="Multiplayer Cost"
          value={unit.multiplayerCost}
          highlight
        />
      </StatSection>

      {/* Survivability */}
      <StatSection title="Survivability">
        <StatRow label="Health" value={unit.health} highlight />
        <StatRow
          label="Health per Entity"
          value={unit.healthPerEntity}
          indent
        />
        <StatRow label="Barrier" value={unit.barrier} />
        <StatRow label="Armour" value={unit.armour} highlight />
        <StatRow label="Parry" value={pct(unit.parry)} indent />
        <StatRow label="Ward Save" value={pct(unit.wardSave)} indent />
        <StatRow
          label="Physical Resistance"
          value={pct(unit.physicalResistance)}
          indent
        />
        <StatRow
          label="Missile Resistance"
          value={pct(unit.missileResistance)}
          indent
        />
        <StatRow
          label="Spell Resistance"
          value={pct(unit.spellResistance)}
          indent
        />
        <StatRow
          label="Fire Resistance"
          value={pct(unit.fireResistance)}
          indent
        />
        <StatRow label="Leadership" value={unit.leadership} highlight />
      </StatSection>

      {/* Mobility */}
      <StatSection title="Mobility">
        <StatRow label="Speed" value={unit.speed} highlight />
        <StatRow label="Charge Speed" value={unit.chargeSpeed} />
      </StatSection>

      {/* Melee Combat */}
      <StatSection title="Melee Combat">
        <StatRow label="Melee Attack" value={unit.meleeAttack} highlight />
        {unit.meleeImbuement && (
          <StatRow label="Imbuement" value={unit.meleeImbuement.name} />
        )}
        <StatRow label="Attack Interval" value={unit.attackInterval} indent />
        <StatRow
          label="High Threat"
          value={
            unit.highThreat ? "Yes" : unit.highThreat === false ? "No" : null
          }
          indent
        />
        <StatRow
          label="Splash Target Size"
          value={unit.splashTargetSize}
          indent
        />
        <StatRow
          label="Splash Max Attacks"
          value={unit.splashMaxAttacks}
          indent
        />
        <StatRow label="Melee Defense" value={unit.meleeDefense} highlight />
        <StatRow
          label="Weapon Strength"
          value={unit.weaponStrength}
          highlight
        />
        <StatRow label="Base Damage" value={unit.meleeBaseDamage} indent />
        <StatRow label="AP Damage" value={unit.meleeApDamage} indent />
        <StatRow label="Bonus vs Large" value={unit.meleeBonusVsLarge} indent />
        <StatRow
          label="Bonus vs Infantry"
          value={unit.meleeBonusVsInfantry}
          indent
        />
        <StatRow label="Charge Bonus" value={unit.chargeBonus} highlight />
      </StatSection>

      {/* Ranged Combat */}
      {unit.rangedMode !== "NONE" &&
        unit.rangedWeapons.map((weapon, index) => (
          <StatSection
            key={weapon.id}
            title={
              unit.rangedMode === "DUAL"
                ? `${index === 0 ? "Primary" : "Secondary"} Ranged Weapon`
                : "Ranged Combat"
            }
          >
            <StatRow label="Ammunition" value={weapon.ammunition} highlight />
            <StatRow label="Range" value={weapon.range} highlight />
            <StatRow
              label="Base Damage"
              value={weapon.missileBaseDamage}
              indent
            />
            <StatRow label="AP Damage" value={weapon.missileApDamage} indent />
            <StatRow
              label="Bonus vs Large"
              value={weapon.missileBonusVsLarge}
              indent
            />
            <StatRow
              label="Bonus vs Infantry"
              value={weapon.missileBonusVsInfantry}
              indent
            />
            <StatRow
              label="Explosion Damage"
              value={weapon.explosionDamage}
              indent
            />
            <StatRow
              label="Explosion AP Damage"
              value={weapon.explosionApDamage}
              indent
            />
            <StatRow
              label="Detonation Radius"
              value={weapon.detonationRadius}
              indent
            />
            <StatRow label="Shots per Volley" value={weapon.shotsPerVolley} />
            <StatRow
              label="Projectile Number"
              value={weapon.projectileNumber}
              indent
            />
            <StatRow
              label="Projectile Category"
              value={weapon.projectileCategory}
              indent
            />
            <StatRow label="Reload Time" value={weapon.reloadTime} />
            <StatRow
              label="Total Accuracy"
              value={weapon.totalAccuracy}
              indent
            />
            <StatRow
              label="Calibration Distance"
              value={weapon.calibrationDistance}
              indent
            />
            <StatRow
              label="Calibration Area"
              value={weapon.calibrationArea}
              indent
            />
            <StatRow
              label="Penetration Size Cap"
              value={weapon.penetrationSizeCap}
              indent
            />
            <StatRow
              label="Max Penetration"
              value={weapon.maxPenetration}
              indent
            />
            {weapon.imbuementVariantId && (
              <StatRow
                label="Imbuement"
                value={`#${weapon.imbuementVariantId}`}
              />
            )}
          </StatSection>
        ))}
    </div>
  );
}

"use client";

import {
  AdminFormField,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminFormField";
import { ImbuementVariantDTO } from "@/lib/types";

export interface RangedWeaponFormData {
  weaponSlot: string;
  imbuementVariantId: string;
  ammunition: string;
  range: string;
  missileBaseDamage: string;
  missileApDamage: string;
  missileBonusVsLarge: string;
  missileBonusVsInfantry: string;
  explosionDamage: string;
  explosionApDamage: string;
  detonationRadius: string;
  shotsPerVolley: string;
  projectileNumber: string;
  projectileCategory: string;
  reloadTime: string;
  totalAccuracy: string;
  calibrationDistance: string;
  calibrationArea: string;
  penetrationSizeCap: string;
  maxPenetration: string;
}

export const emptyRangedWeapon = (
  slot: "primary" | "secondary",
): RangedWeaponFormData => ({
  weaponSlot: slot,
  imbuementVariantId: "",
  ammunition: "",
  range: "",
  missileBaseDamage: "",
  missileApDamage: "",
  missileBonusVsLarge: "",
  missileBonusVsInfantry: "",
  explosionDamage: "",
  explosionApDamage: "",
  detonationRadius: "",
  shotsPerVolley: "",
  projectileNumber: "",
  projectileCategory: "",
  reloadTime: "",
  totalAccuracy: "",
  calibrationDistance: "",
  calibrationArea: "",
  penetrationSizeCap: "",
  maxPenetration: "",
});

interface RangedWeaponSubFormProps {
  weapon: RangedWeaponFormData;
  label: string;
  imbuements: ImbuementVariantDTO[];
  onChange: (updated: RangedWeaponFormData) => void;
}

export default function RangedWeaponSubForm({
  weapon,
  label,
  imbuements,
  onChange,
}: RangedWeaponSubFormProps) {
  const set =
    (key: keyof RangedWeaponFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...weapon, [key]: e.target.value });

  return (
    <div className="bg-bg-raised border border-border-subtle rounded-md p-4 space-y-4">
      <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold-bright">
        {label}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminFormField label="Ammunition">
          <AdminInput
            type="number"
            value={weapon.ammunition}
            onChange={set("ammunition")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Range">
          <AdminInput
            type="number"
            value={weapon.range}
            onChange={set("range")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Shots/Volley">
          <AdminInput
            type="number"
            value={weapon.shotsPerVolley}
            onChange={set("shotsPerVolley")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Reload Time">
          <AdminInput
            type="number"
            value={weapon.reloadTime}
            onChange={set("reloadTime")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Base Damage">
          <AdminInput
            type="number"
            value={weapon.missileBaseDamage}
            onChange={set("missileBaseDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="AP Damage">
          <AdminInput
            type="number"
            value={weapon.missileApDamage}
            onChange={set("missileApDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Bonus vs Large">
          <AdminInput
            type="number"
            value={weapon.missileBonusVsLarge}
            onChange={set("missileBonusVsLarge")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Bonus vs Infantry">
          <AdminInput
            type="number"
            value={weapon.missileBonusVsInfantry}
            onChange={set("missileBonusVsInfantry")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Explosion Damage">
          <AdminInput
            type="number"
            value={weapon.explosionDamage}
            onChange={set("explosionDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Explosion AP Dmg">
          <AdminInput
            type="number"
            value={weapon.explosionApDamage}
            onChange={set("explosionApDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Detonation Radius">
          <AdminInput
            type="number"
            value={weapon.detonationRadius}
            onChange={set("detonationRadius")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Projectile Number">
          <AdminInput
            type="number"
            value={weapon.projectileNumber}
            onChange={set("projectileNumber")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Total Accuracy">
          <AdminInput
            type="number"
            value={weapon.totalAccuracy}
            onChange={set("totalAccuracy")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Calibration Dist.">
          <AdminInput
            type="number"
            value={weapon.calibrationDistance}
            onChange={set("calibrationDistance")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Calibration Area">
          <AdminInput
            type="number"
            value={weapon.calibrationArea}
            onChange={set("calibrationArea")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Max Penetration">
          <AdminInput
            type="number"
            value={weapon.maxPenetration}
            onChange={set("maxPenetration")}
            placeholder="0"
          />
        </AdminFormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Projectile Category">
          <AdminInput
            value={weapon.projectileCategory}
            onChange={set("projectileCategory")}
            placeholder="e.g. missile_magical"
          />
        </AdminFormField>
        <AdminFormField label="Penetration Size Cap">
          <AdminSelect
            value={weapon.penetrationSizeCap}
            onChange={set("penetrationSizeCap")}
            placeholder="None"
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "very_large", label: "Very Large" },
            ]}
          />
        </AdminFormField>
      </div>

      {imbuements.length > 0 && (
        <AdminFormField label="Imbuement">
          <AdminSelect
            value={weapon.imbuementVariantId}
            onChange={set("imbuementVariantId")}
            placeholder="None"
            options={imbuements.map((i) => ({
              value: String(i.id),
              label: i.name,
            }))}
          />
        </AdminFormField>
      )}
    </div>
  );
}

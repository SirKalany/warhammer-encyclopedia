"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  UnitSummaryDTO,
  GameVersionDTO,
  UnitRole,
  UnitCategoryType,
  RangedMode,
  AbilityVariantSummaryDTO,
  SpellVariantSummaryDTO,
  ItemVariantSummaryDTO,
  UnitAttributeDTO,
  ImbuementVariantDTO,
  BuildingVariantSummaryDTO,
} from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminCheckbox,
} from "@/components/admin/AdminFormField";

const ROLES: UnitRole[] = [
  "LORDS",
  "HEROES",
  "MELEE_INFANTRY",
  "MISSILE_INFANTRY",
  "MELEE_CAVALRY",
  "MISSILE_CAVALRY",
  "CHARIOTS",
  "WAR_BEASTS",
  "MONSTROUS_INFANTRY",
  "MONSTERS",
  "WAR_MACHINES",
  "ARTILLERY",
];

const CATEGORY_TYPES: UnitCategoryType[] = [
  "REGULAR",
  "LEGENDARY",
  "LANDMARK",
  "RENOWNED",
  "RAISED",
];

interface UnitVariantFormProps {
  id?: number;
}

export default function UnitVariantForm({ id }: UnitVariantFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);

  // Reference data
  const [units, setUnits] = useState<UnitSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [abilities, setAbilities] = useState<AbilityVariantSummaryDTO[]>([]);
  const [spells, setSpells] = useState<SpellVariantSummaryDTO[]>([]);
  const [items, setItems] = useState<ItemVariantSummaryDTO[]>([]);
  const [unitAttributes, setUnitAttributes] = useState<UnitAttributeDTO[]>([]);
  const [imbuements, setImbuements] = useState<ImbuementVariantDTO[]>([]);
  const [buildings, setBuildings] = useState<BuildingVariantSummaryDTO[]>([]);

  // Form state
  const [form, setForm] = useState({
    unitId: "",
    gameVersionId: "",
    displayName: "",
    picture: "",
    tier: "",
    category: "",
    role: "" as UnitRole,
    categoryType: "REGULAR" as UnitCategoryType,
    description: "",
    size: "small",
    entities: "",
    mass: "",
    campaignCost: "",
    baseUpkeep: "",
    multiplayerCost: "",
    health: "",
    healthPerEntity: "",
    barrier: "",
    armour: "",
    parry: "",
    wardSave: "",
    physicalResistance: "",
    missileResistance: "",
    spellResistance: "",
    fireResistance: "",
    leadership: "",
    speed: "",
    chargeSpeed: "",
    meleeAttack: "",
    meleeImbuementVariantId: "",
    attackInterval: "",
    highThreat: false,
    splashTargetSize: "",
    splashMaxAttacks: "",
    meleeDefense: "",
    weaponStrength: "",
    meleeBaseDamage: "",
    meleeApDamage: "",
    meleeBonusVsLarge: "",
    meleeBonusVsInfantry: "",
    chargeBonus: "",
    rangedMode: "NONE" as RangedMode,
    unlockBuildingVariantId: "",
    allowBuildingVariantId: "",
    abilityVariantIds: [] as number[],
    passiveAbilityVariantIds: [] as number[],
    spellVariantIds: [] as number[],
    itemVariantIds: [] as number[],
    unitAttributeIds: [] as number[],
    // Attribute lines
    attributeLines: [
      { position: 1, content: "" },
      { position: 2, content: "" },
      { position: 3, content: "" },
      { position: 4, content: "" },
    ],
  });

  useEffect(() => {
    Promise.all([
      api.units.findAll(),
      api.versions.findAll(),
      api.unitAttributes.findAll(),
    ]).then(([units, versions, attributes]) => {
      setUnits(units);
      setVersions(versions);
      setUnitAttributes(attributes);
    });
  }, []);

  const loadVersionData = async (versionId: number) => {
    const [abilities, spells, items, imbuements, buildings] = await Promise.all(
      [
        api.abilityVariants.findByVersion(versionId),
        api.spellVariants.findByVersion(versionId),
        api.itemVariants.findByVersion(versionId),
        api.imbuementVariants.findByVersion(versionId),
        api.buildingVariants.findByVersion(versionId),
      ],
    );
    setAbilities(abilities);
    setSpells(spells);
    setItems(items);
    setImbuements(imbuements);
    setBuildings(buildings);
  };

  const handleVersionChange = (versionId: string) => {
    setForm((p) => ({
      ...p,
      gameVersionId: versionId,
      abilityVariantIds: [],
      passiveAbilityVariantIds: [],
      spellVariantIds: [],
      itemVariantIds: [],
      meleeImbuementVariantId: "",
      unlockBuildingVariantId: "",
      allowBuildingVariantId: "",
    }));
    if (versionId) loadVersionData(Number(versionId));
  };

  useEffect(() => {
    if (isEdit) {
      api.versions.findAll().then((versions) => {
        Promise.all(
          versions.map((v) => api.unitVariants.findByVersion(v.id)),
        ).then((results) => {
          const summary = results.flat().find((uv) => uv.id === id);
          if (!summary) return;
          loadVersionData(summary.gameVersionId).then(() => {
            api.unitVariants
              .findByUnitAndVersion(summary.unitId, summary.gameVersionId)
              .then((full) => {
                setForm({
                  unitId: String(full.unitId),
                  gameVersionId: String(full.gameVersionId),
                  displayName: full.displayName ?? "",
                  picture: full.picture ?? "",
                  tier: String(full.tier),
                  category: full.category ?? "",
                  role: full.role,
                  categoryType: full.categoryType,
                  description: full.description ?? "",
                  size: full.size,
                  entities: full.entities?.toString() ?? "",
                  mass: full.mass?.toString() ?? "",
                  campaignCost: full.campaignCost?.toString() ?? "",
                  baseUpkeep: full.baseUpkeep?.toString() ?? "",
                  multiplayerCost: full.multiplayerCost?.toString() ?? "",
                  health: full.health?.toString() ?? "",
                  healthPerEntity: full.healthPerEntity?.toString() ?? "",
                  barrier: full.barrier?.toString() ?? "",
                  armour: full.armour?.toString() ?? "",
                  parry: full.parry?.toString() ?? "",
                  wardSave: full.wardSave?.toString() ?? "",
                  physicalResistance: full.physicalResistance?.toString() ?? "",
                  missileResistance: full.missileResistance?.toString() ?? "",
                  spellResistance: full.spellResistance?.toString() ?? "",
                  fireResistance: full.fireResistance?.toString() ?? "",
                  leadership: full.leadership?.toString() ?? "",
                  speed: full.speed?.toString() ?? "",
                  chargeSpeed: full.chargeSpeed?.toString() ?? "",
                  meleeAttack: full.meleeAttack?.toString() ?? "",
                  meleeImbuementVariantId:
                    full.meleeImbuementVariantId?.toString() ?? "",
                  attackInterval: full.attackInterval?.toString() ?? "",
                  highThreat: full.highThreat ?? false,
                  splashTargetSize: full.splashTargetSize ?? "",
                  splashMaxAttacks: full.splashMaxAttacks?.toString() ?? "",
                  meleeDefense: full.meleeDefense?.toString() ?? "",
                  weaponStrength: full.weaponStrength?.toString() ?? "",
                  meleeBaseDamage: full.meleeBaseDamage?.toString() ?? "",
                  meleeApDamage: full.meleeApDamage?.toString() ?? "",
                  meleeBonusVsLarge: full.meleeBonusVsLarge?.toString() ?? "",
                  meleeBonusVsInfantry:
                    full.meleeBonusVsInfantry?.toString() ?? "",
                  chargeBonus: full.chargeBonus?.toString() ?? "",
                  rangedMode: full.rangedMode,
                  unlockBuildingVariantId:
                    full.unlockBuildingVariantId?.toString() ?? "",
                  allowBuildingVariantId:
                    full.allowBuildingVariantId?.toString() ?? "",
                  abilityVariantIds: full.abilityVariantIds,
                  passiveAbilityVariantIds: full.passiveAbilityVariantIds,
                  spellVariantIds: full.spellVariantIds,
                  itemVariantIds: full.itemVariantIds,
                  unitAttributeIds: full.unitAttributeIds,
                  attributeLines: [1, 2, 3, 4].map((pos) => ({
                    position: pos,
                    content:
                      full.attributeLines.find((l) => l.position === pos)
                        ?.content ?? "",
                  })),
                });
              });
          });
        });
      });
    }
  }, [id, isEdit]);

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggle = (
    key:
      | "abilityVariantIds"
      | "passiveAbilityVariantIds"
      | "spellVariantIds"
      | "itemVariantIds"
      | "unitAttributeIds",
    itemId: number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(itemId)
        ? prev[key].filter((id) => id !== itemId)
        : [...prev[key], itemId],
    }));
  };

  const num = (val: string) => (val ? Number(val) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const unit = units.find((u) => u.id === Number(form.unitId));
      const attributeLines = form.attributeLines
        .filter((l) => l.content.trim() !== "")
        .map((l) => ({
          id: 0,
          position: l.position as unknown as number,
          content: l.content,
        }));

      const payload = {
        unitId: Number(form.unitId),
        name: unit?.name ?? "",
        slug: unit?.slug ?? "",
        gameVersionId: Number(form.gameVersionId),
        displayName: form.displayName || null,
        raceIds: unit?.raceIds ?? [],
        picture: form.picture || null,
        tier: Number(form.tier) as unknown as number,
        category: form.category || null,
        role: form.role,
        categoryType: form.categoryType,
        description: form.description || null,
        size: form.size,
        entities: num(form.entities),
        mass: num(form.mass),
        campaignCost: num(form.campaignCost),
        baseUpkeep: num(form.baseUpkeep),
        multiplayerCost: num(form.multiplayerCost),
        health: num(form.health),
        healthPerEntity: num(form.healthPerEntity),
        barrier: num(form.barrier),
        armour: num(form.armour),
        parry: num(form.parry),
        wardSave: num(form.wardSave),
        physicalResistance: num(form.physicalResistance),
        missileResistance: num(form.missileResistance),
        spellResistance: num(form.spellResistance),
        fireResistance: num(form.fireResistance),
        leadership: num(form.leadership),
        speed: num(form.speed),
        chargeSpeed: num(form.chargeSpeed),
        meleeAttack: num(form.meleeAttack),
        meleeImbuement: null,
        meleeImbuementVariantId: form.meleeImbuementVariantId
          ? Number(form.meleeImbuementVariantId)
          : null,
        attackInterval: num(form.attackInterval),
        highThreat: form.highThreat,
        splashTargetSize: form.splashTargetSize || null,
        splashMaxAttacks: num(form.splashMaxAttacks),
        meleeDefense: num(form.meleeDefense),
        weaponStrength: num(form.weaponStrength),
        meleeBaseDamage: num(form.meleeBaseDamage),
        meleeApDamage: num(form.meleeApDamage),
        meleeBonusVsLarge: num(form.meleeBonusVsLarge),
        meleeBonusVsInfantry: num(form.meleeBonusVsInfantry),
        chargeBonus: num(form.chargeBonus),
        rangedMode: form.rangedMode,
        rangedWeapons: [],
        unlockBuildingVariantId: form.unlockBuildingVariantId
          ? Number(form.unlockBuildingVariantId)
          : null,
        allowBuildingVariantId: form.allowBuildingVariantId
          ? Number(form.allowBuildingVariantId)
          : null,
        attributeLines,
        unitAttributes: [],
        abilities: [],
        passiveAbilities: [],
        spells: [],
        items: [],
        abilityVariantIds: form.abilityVariantIds,
        passiveAbilityVariantIds: form.passiveAbilityVariantIds,
        spellVariantIds: form.spellVariantIds,
        itemVariantIds: form.itemVariantIds,
        unitAttributeIds: form.unitAttributeIds,
        unlockBuildingId: form.unlockBuildingVariantId
          ? Number(form.unlockBuildingVariantId)
          : null,
        allowBuildingId: form.allowBuildingVariantId
          ? Number(form.allowBuildingVariantId)
          : null,
      };
      if (isEdit) await api.unitVariants.update(id, payload);
      else await api.unitVariants.create(payload);
      router.push("/admin/unit-variants");
    } finally {
      setIsLoading(false);
    }
  };

  const ToggleGroup = ({
    label,
    hint,
    keys,
    pool,
  }: {
    label: string;
    hint?: string;
    keys:
      | "abilityVariantIds"
      | "passiveAbilityVariantIds"
      | "spellVariantIds"
      | "itemVariantIds"
      | "unitAttributeIds";
    pool: { id: number; name: string }[];
  }) =>
    pool.length === 0 ? null : (
      <AdminFormField label={label} hint={hint ?? "Click to toggle"}>
        <div className="flex flex-wrap gap-2 mt-1">
          {pool.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(keys, item.id)}
              className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-sm border transition-all duration-150 ${(form[keys] as number[]).includes(item.id) ? "bg-gold-subtle border-gold-bright text-gold-bright" : "bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </AdminFormField>
    );

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Unit Variant" : "New Unit Variant"}
      backHref="/admin/unit-variants"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      {/* Identity + Version */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Unit" required>
          <AdminSelect
            value={form.unitId}
            onChange={set("unitId")}
            placeholder="Select unit..."
            options={units.map((u) => ({ value: String(u.id), label: u.name }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Game Version" required>
          <AdminSelect
            value={form.gameVersionId}
            onChange={(e) => handleVersionChange(e.target.value)}
            placeholder="Select version..."
            options={versions.map((v) => ({
              value: String(v.id),
              label: v.name,
            }))}
            required
          />
        </AdminFormField>
      </div>

      {/* Display */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Display
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField
          label="Display Name"
          hint="Leave blank to use the unit's canonical name"
        >
          <AdminInput
            value={form.displayName}
            onChange={set("displayName")}
            placeholder="Override name for this version..."
          />
        </AdminFormField>
        <AdminFormField label="Picture" hint="Path to image">
          <AdminInput
            value={form.picture}
            onChange={set("picture")}
            placeholder="/images/units/..."
          />
        </AdminFormField>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminFormField label="Tier" required>
          <AdminSelect
            value={form.tier}
            onChange={set("tier")}
            placeholder="Select tier..."
            options={[1, 2, 3, 4, 5].map((t) => ({
              value: String(t),
              label: `Tier ${t}`,
            }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Role" required>
          <AdminSelect
            value={form.role}
            onChange={set("role")}
            placeholder="Select role..."
            options={ROLES.map((r) => ({
              value: r,
              label: r.replace(/_/g, " "),
            }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Category Type" required>
          <AdminSelect
            value={form.categoryType}
            onChange={set("categoryType")}
            placeholder="Select type..."
            options={CATEGORY_TYPES.map((c) => ({ value: c, label: c }))}
            required
          />
        </AdminFormField>
      </div>
      <AdminFormField label="Category" hint="e.g. Monstrous Shock Cavalry">
        <AdminInput
          value={form.category}
          onChange={set("category")}
          placeholder="e.g. Shock Infantry"
        />
      </AdminFormField>
      <AdminFormField label="Description">
        <AdminTextarea
          value={form.description}
          onChange={set("description")}
          placeholder="Lore description..."
        />
      </AdminFormField>

      {/* Attribute lines */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Attribute Lines (max 4)
      </p>
      <div className="space-y-2">
        {form.attributeLines.map((line, index) => (
          <AdminFormField key={line.position} label={`Line ${line.position}`}>
            <AdminInput
              value={line.content}
              onChange={(e) => {
                const updated = [...form.attributeLines];
                updated[index] = { ...updated[index], content: e.target.value };
                setForm((p) => ({ ...p, attributeLines: updated }));
              }}
              placeholder={`Strength or weakness ${line.position}...`}
            />
          </AdminFormField>
        ))}
      </div>

      {/* Overview */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Overview
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminFormField label="Size" required>
          <AdminSelect
            value={form.size}
            onChange={set("size")}
            options={[
              { value: "small", label: "Small" },
              { value: "large", label: "Large" },
            ]}
          />
        </AdminFormField>
        <AdminFormField label="Entities">
          <AdminInput
            type="number"
            value={form.entities}
            onChange={set("entities")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Mass">
          <AdminInput
            type="number"
            value={form.mass}
            onChange={set("mass")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Campaign Cost">
          <AdminInput
            type="number"
            value={form.campaignCost}
            onChange={set("campaignCost")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Base Upkeep">
          <AdminInput
            type="number"
            value={form.baseUpkeep}
            onChange={set("baseUpkeep")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="MP Cost">
          <AdminInput
            type="number"
            value={form.multiplayerCost}
            onChange={set("multiplayerCost")}
            placeholder="0"
          />
        </AdminFormField>
      </div>

      {/* Survivability */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Survivability
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminFormField label="Health">
          <AdminInput
            type="number"
            value={form.health}
            onChange={set("health")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Health/Entity">
          <AdminInput
            type="number"
            value={form.healthPerEntity}
            onChange={set("healthPerEntity")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Barrier">
          <AdminInput
            type="number"
            value={form.barrier}
            onChange={set("barrier")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Armour">
          <AdminInput
            type="number"
            value={form.armour}
            onChange={set("armour")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Parry %">
          <AdminInput
            type="number"
            value={form.parry}
            onChange={set("parry")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Ward Save %">
          <AdminInput
            type="number"
            value={form.wardSave}
            onChange={set("wardSave")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Physical Res. %">
          <AdminInput
            type="number"
            value={form.physicalResistance}
            onChange={set("physicalResistance")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Missile Res. %">
          <AdminInput
            type="number"
            value={form.missileResistance}
            onChange={set("missileResistance")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Spell Res. %">
          <AdminInput
            type="number"
            value={form.spellResistance}
            onChange={set("spellResistance")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Fire Res. %">
          <AdminInput
            type="number"
            value={form.fireResistance}
            onChange={set("fireResistance")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Leadership">
          <AdminInput
            type="number"
            value={form.leadership}
            onChange={set("leadership")}
            placeholder="0"
          />
        </AdminFormField>
      </div>

      {/* Mobility */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Mobility
      </p>
      <div className="grid grid-cols-2 gap-4">
        <AdminFormField label="Speed">
          <AdminInput
            type="number"
            value={form.speed}
            onChange={set("speed")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Charge Speed">
          <AdminInput
            type="number"
            value={form.chargeSpeed}
            onChange={set("chargeSpeed")}
            placeholder="0"
          />
        </AdminFormField>
      </div>

      {/* Melee */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Melee Combat
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminFormField label="Melee Attack">
          <AdminInput
            type="number"
            value={form.meleeAttack}
            onChange={set("meleeAttack")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Attack Interval">
          <AdminInput
            type="number"
            value={form.attackInterval}
            onChange={set("attackInterval")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Splash Target Size">
          <AdminSelect
            value={form.splashTargetSize}
            onChange={set("splashTargetSize")}
            placeholder="None"
            options={["small", "medium", "large", "very_large"].map((s) => ({
              value: s,
              label: s,
            }))}
          />
        </AdminFormField>
        <AdminFormField label="Splash Max Attacks">
          <AdminInput
            type="number"
            value={form.splashMaxAttacks}
            onChange={set("splashMaxAttacks")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Melee Defense">
          <AdminInput
            type="number"
            value={form.meleeDefense}
            onChange={set("meleeDefense")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Weapon Strength">
          <AdminInput
            type="number"
            value={form.weaponStrength}
            onChange={set("weaponStrength")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Base Damage">
          <AdminInput
            type="number"
            value={form.meleeBaseDamage}
            onChange={set("meleeBaseDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="AP Damage">
          <AdminInput
            type="number"
            value={form.meleeApDamage}
            onChange={set("meleeApDamage")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Bonus vs Large">
          <AdminInput
            type="number"
            value={form.meleeBonusVsLarge}
            onChange={set("meleeBonusVsLarge")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Bonus vs Infantry">
          <AdminInput
            type="number"
            value={form.meleeBonusVsInfantry}
            onChange={set("meleeBonusVsInfantry")}
            placeholder="0"
          />
        </AdminFormField>
        <AdminFormField label="Charge Bonus">
          <AdminInput
            type="number"
            value={form.chargeBonus}
            onChange={set("chargeBonus")}
            placeholder="0"
          />
        </AdminFormField>
      </div>
      <AdminCheckbox
        label="High Threat"
        checked={form.highThreat}
        onChange={(e) =>
          setForm((p) => ({ ...p, highThreat: e.target.checked }))
        }
      />

      {imbuements.length > 0 && (
        <AdminFormField label="Melee Imbuement">
          <AdminSelect
            value={form.meleeImbuementVariantId}
            onChange={set("meleeImbuementVariantId")}
            placeholder="None"
            options={imbuements.map((i) => ({
              value: String(i.id),
              label: i.name,
            }))}
          />
        </AdminFormField>
      )}

      {/* Ranged */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Ranged Combat
      </p>
      <AdminFormField label="Ranged Mode">
        <AdminSelect
          value={form.rangedMode}
          onChange={set("rangedMode")}
          options={[
            { value: "NONE", label: "None" },
            { value: "SINGLE", label: "Single" },
            { value: "DUAL", label: "Dual" },
          ]}
        />
      </AdminFormField>

      {/* Building requirements */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Building Requirements
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Unlock Building">
          <AdminSelect
            value={form.unlockBuildingVariantId}
            onChange={set("unlockBuildingVariantId")}
            placeholder="None"
            options={buildings.map((b) => ({
              value: String(b.id),
              label: b.name,
            }))}
          />
        </AdminFormField>
        <AdminFormField label="Allow Building">
          <AdminSelect
            value={form.allowBuildingVariantId}
            onChange={set("allowBuildingVariantId")}
            placeholder="None"
            options={buildings.map((b) => ({
              value: String(b.id),
              label: b.name,
            }))}
          />
        </AdminFormField>
      </div>

      {/* Relations */}
      <p className="font-display text-xs tracking-widest uppercase text-text-muted pt-2">
        Relations
      </p>

      <ToggleGroup
        label="Unit Attributes"
        keys="unitAttributeIds"
        pool={unitAttributes.map((a) => ({ id: a.id!, name: a.name }))}
      />
      <ToggleGroup
        label="Active Abilities"
        keys="abilityVariantIds"
        pool={abilities.map((a) => ({ id: a.id, name: a.name }))}
      />
      <ToggleGroup
        label="Passive Abilities"
        keys="passiveAbilityVariantIds"
        pool={abilities.map((a) => ({ id: a.id, name: a.name }))}
      />
      <ToggleGroup
        label="Spells"
        keys="spellVariantIds"
        pool={spells.map((s) => ({ id: s.id, name: s.name }))}
      />
      <ToggleGroup
        label="Restricted Items"
        keys="itemVariantIds"
        pool={items.map((i) => ({ id: i.id, name: i.name }))}
      />
    </AdminFormWrapper>
  );
}

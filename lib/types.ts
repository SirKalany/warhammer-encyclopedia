// ============================================================
// Enums
// ============================================================

export type UnitRole =
  | "LORDS"
  | "HEROES"
  | "MELEE_INFANTRY"
  | "MISSILE_INFANTRY"
  | "MELEE_CAVALRY"
  | "MISSILE_CAVALRY"
  | "CHARIOTS"
  | "WAR_BEASTS"
  | "MONSTROUS_INFANTRY"
  | "MONSTERS"
  | "WAR_MACHINES"
  | "ARTILLERY";

export type UnitCategoryType =
  | "REGULAR"
  | "LEGENDARY"
  | "LANDMARK"
  | "RENOWNED"
  | "RAISED";

export type RangedMode = "NONE" | "SINGLE" | "DUAL";

export type AbilityType =
  | "AUGMENT"
  | "REGENERATION"
  | "HEX"
  | "MAGIC_MISSILE"
  | "WIND"
  | "BREATH"
  | "DIRECT_DAMAGE"
  | "BOMBARDMENT"
  | "EXPLOSION"
  | "HIDING"
  | "VORTEX"
  | "SUMMON";

export type BuildingCategory =
  | "SETTLEMENT"
  | "PORT"
  | "MILITARY_RECRUITMENT"
  | "MILITARY_SUPPORT"
  | "DEFENSE"
  | "INFRASTRUCTURE"
  | "RESOURCE"
  | "LANDMARK";

export type ItemCategory =
  | "ARMOUR"
  | "ENCHANTED_ITEM"
  | "TALISMAN"
  | "WEAPON"
  | "ARCANE_ITEM";

export type ItemRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "LEGENDARY"
  | "CRAFTED";

export type ClimateStatus = "HABITABLE" | "UNPLEASANT" | "UNINHABITABLE";

// ============================================================
// Shared
// ============================================================

export interface ImbuementDTO {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface UnitAttributeDTO {
  id: number;
  name: string;
  description: string | null;
}

// ============================================================
// Race
// ============================================================

export interface RaceSummaryDTO {
  id: number;
  name: string;
  slug: string;
}

export interface RaceDTO {
  id: number;
  name: string;
  slug: string;
}

// ============================================================
// Faction
// ============================================================

export interface FactionSummaryDTO {
  id: number;
  raceId: number;
  name: string;
  slug: string;
  banner: string | null;
}

export interface FactionDTO {
  id: number;
  raceId: number;
  name: string;
  slug: string;
  banner: string | null;
  leader: string | null;
  factionEffect: string | null;
  isHorde: boolean;
  climateChaoticWasteland: ClimateStatus;
  climateFrozen: ClimateStatus;
  climateMountain: ClimateStatus;
  climateTemperate: ClimateStatus;
  climateTemperateIsland: ClimateStatus;
  climateMagicalForest: ClimateStatus;
  climateJungle: ClimateStatus;
  climateSavannah: ClimateStatus;
  climateDesert: ClimateStatus;
  climateWasteland: ClimateStatus;
  climateOcean: ClimateStatus;
}

// ============================================================
// Lore of Magic
// ============================================================

export interface LoreOfMagicSummaryDTO {
  id: number;
  name: string;
  slug: string;
}

export interface LoreOfMagicDTO {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

// ============================================================
// Ability
// ============================================================

export interface AbilitySummaryDTO {
  id: number;
  name: string;
  slug: string;
  type: AbilityType;
}

export interface AbilityDTO {
  id: number;
  name: string;
  slug: string;
  type: AbilityType;
  effect: string | null;
  target: string | null;
  range: number | null;
  radius: number | null;
  duration: number | null;
  cooldown: number | null;
  affectedUnits: number | null;
  uses: number | null;
  conditions: string | null;
  baseDamage: number | null;
  explosiveDamage: number | null;
  damagePerSecond: number | null;
  movementSpeed: number | null;
}

// ============================================================
// Spell
// ============================================================

export interface SpellSummaryDTO {
  id: number;
  loreId: number;
  name: string;
  slug: string;
  type: AbilityType;
}

export interface SpellDTO {
  id: number;
  loreId: number;
  name: string;
  slug: string;
  type: AbilityType;
  effect: string | null;
  target: string | null;
  range: number | null;
  radius: number | null;
  duration: number | null;
  cooldown: number | null;
  affectedUnits: number | null;
  uses: number | null;
  conditions: string | null;
  baseDamage: number | null;
  explosiveDamage: number | null;
  damagePerSecond: number | null;
  movementSpeed: number | null;
  cost: number | null;
  miscastChance: number | null;
  overcastEffect: string | null;
  overcastTarget: string | null;
  overcastRange: number | null;
  overcastRadius: number | null;
  overcastDuration: number | null;
  overcastCooldown: number | null;
  overcastAffectedUnits: number | null;
  overcastBaseDamage: number | null;
  overcastExplosiveDamage: number | null;
  overcastDamagePerSecond: number | null;
  overcastMovementSpeed: number | null;
  overcastCost: number | null;
  overcastMiscastChance: number | null;
}

// ============================================================
// Item
// ============================================================

export interface ItemSummaryDTO {
  id: number;
  name: string;
  slug: string;
  category: ItemCategory;
  rarity: ItemRarity;
  raceId: number | null;
}

export interface ItemDTO {
  id: number;
  name: string;
  slug: string;
  picture: string | null;
  category: ItemCategory;
  rarity: ItemRarity;
  effect: string | null;
  raceId: number | null;
  abilityIds: number[];
  spellIds: number[];
}

// ============================================================
// Building
// ============================================================

export interface BuildingChainSummaryDTO {
  id: number;
  raceId: number;
  name: string;
  slug: string;
  category: BuildingCategory;
}

export interface BuildingChainDTO {
  id: number;
  raceId: number;
  name: string;
  slug: string;
  category: BuildingCategory;
  description: string | null;
}

export interface BuildingSummaryDTO {
  id: number;
  raceId: number;
  buildingChainId: number | null;
  name: string;
  slug: string;
  tier: number | null;
  category: BuildingCategory;
}

export interface BuildingDTO {
  id: number;
  raceId: number;
  buildingChainId: number | null;
  name: string;
  slug: string;
  picture: string | null;
  tier: number | null;
  category: BuildingCategory;
  effect: string | null;
  cost: number | null;
  requirements: string | null;
}

// ============================================================
// Unit
// ============================================================

export interface RangedWeaponDTO {
  id: number;
  weaponSlot: string;
  imbuementId: number | null;
  ammunition: number | null;
  range: number | null;
  missileBaseDamage: number | null;
  missileApDamage: number | null;
  missileBonusVsLarge: number | null;
  missileBonusVsInfantry: number | null;
  explosionDamage: number | null;
  explosionApDamage: number | null;
  detonationRadius: number | null;
  shotsPerVolley: number | null;
  projectileNumber: number | null;
  projectileCategory: string | null;
  reloadTime: number | null;
  totalAccuracy: number | null;
  calibrationDistance: number | null;
  calibrationArea: number | null;
  penetrationSizeCap: string | null;
  maxPenetration: number | null;
}

export interface UnitAttributeLineDTO {
  id: number;
  position: number;
  content: string;
}

export interface UnitSummaryDTO {
  id: number;
  raceId: number;
  name: string;
  slug: string;
  picture: string | null;
  tier: number;
  category: string | null;
  role: UnitRole;
  categoryType: UnitCategoryType;
}

export interface UnitDTO {
  id: number;
  raceId: number;
  name: string;
  slug: string;
  picture: string | null;
  tier: number;
  category: string | null;
  role: UnitRole;
  categoryType: UnitCategoryType;
  description: string | null;

  // Overview
  size: string;
  entities: number | null;
  mass: number | null;
  campaignCost: number | null;
  baseUpkeep: number | null;
  multiplayerCost: number | null;

  // Survivability
  health: number | null;
  healthPerEntity: number | null;
  barrier: number | null;
  armour: number | null;
  parry: number | null;
  wardSave: number | null;
  physicalResistance: number | null;
  missileResistance: number | null;
  spellResistance: number | null;
  fireResistance: number | null;
  leadership: number | null;

  // Mobility
  speed: number | null;
  chargeSpeed: number | null;

  // Melee
  meleeAttack: number | null;
  meleeImbuement: ImbuementDTO | null;
  attackInterval: number | null;
  highThreat: boolean | null;
  splashTargetSize: string | null;
  splashMaxAttacks: number | null;
  meleeDefense: number | null;
  weaponStrength: number | null;
  meleeBaseDamage: number | null;
  meleeApDamage: number | null;
  meleeBonusVsLarge: number | null;
  meleeBonusVsInfantry: number | null;
  chargeBonus: number | null;

  // Ranged
  rangedMode: RangedMode;
  rangedWeapons: RangedWeaponDTO[];

  // Buildings
  unlockBuildingId: number | null;
  allowBuildingId: number | null;

  // Relations
  attributeLines: UnitAttributeLineDTO[];
  unitAttributes: UnitAttributeDTO[];
  abilities: AbilitySummaryDTO[];
  passiveAbilities: AbilitySummaryDTO[];
  spells: SpellSummaryDTO[];
  items: ItemSummaryDTO[];
}

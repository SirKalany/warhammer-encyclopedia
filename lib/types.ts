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
// Game Version
// ============================================================

export interface GameVersionDTO {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

// ============================================================
// Identity DTOs
// ============================================================

export interface RaceDTO {
  id: number;
  name: string;
  slug: string;
}

export interface RaceSummaryDTO {
  id: number;
  name: string;
  slug: string;
}

export interface LoreOfMagicDTO {
  id: number;
  name: string;
  slug: string;
}

export interface LoreOfMagicSummaryDTO {
  id: number;
  name: string;
  slug: string;
}

export interface AbilityDTO {
  id: number;
  name: string;
  slug: string;
  type: AbilityType;
}

export interface AbilitySummaryDTO {
  id: number;
  name: string;
  slug: string;
  type: AbilityType;
}

export interface SpellDTO {
  id: number;
  name: string;
  slug: string;
  type: AbilityType;
  loreId: number;
}

export interface SpellSummaryDTO {
  id: number;
  name: string;
  slug: string;
  type: AbilityType;
  loreId: number;
}

export interface ItemDTO {
  id: number;
  name: string;
  slug: string;
  category: ItemCategory;
  rarity: ItemRarity;
}

export interface ItemSummaryDTO {
  id: number;
  name: string;
  slug: string;
  category: ItemCategory;
  rarity: ItemRarity;
}

export interface ImbuementDTO {
  id: number;
  name: string;
  slug: string;
}

export interface UnitAttributeDTO {
  id: number;
  name: string;
}

export interface FactionDTO {
  id: number;
  name: string;
  slug: string;
  raceId: number;
}

export interface FactionSummaryDTO {
  id: number;
  name: string;
  slug: string;
  raceId: number;
}

export interface BuildingChainDTO {
  id: number;
  name: string;
  slug: string;
  raceId: number;
  category: BuildingCategory;
}

export interface BuildingChainSummaryDTO {
  id: number;
  name: string;
  slug: string;
  raceId: number;
  category: BuildingCategory;
}

export interface BuildingDTO {
  id: number;
  name: string;
  slug: string;
  raceId: number;
  buildingChainId: number | null;
  category: BuildingCategory;
}

export interface BuildingSummaryDTO {
  id: number;
  name: string;
  slug: string;
  raceId: number;
  buildingChainId: number | null;
  category: BuildingCategory;
}

export interface UnitDTO {
  categoryType: any;
  picture: string | Blob | undefined;
  id: number;
  name: string;
  slug: string;
  raceIds: number[];
}

export interface UnitSummaryDTO {
  id: number;
  name: string;
  slug: string;
  raceIds: number[];
}

// ============================================================
// Variant DTOs
// ============================================================

export interface ImbuementVariantDTO {
  id: number;
  imbuementId: number;
  name: string;
  slug: string;
  gameVersionId: number;
  description: string | null;
  icon: string | null;
}

export interface UnitAttributeVariantDTO {
  id: number | null;
  unitAttributeId: number;
  name: string;
  gameVersionId: number;
  description: string | null;
}

export interface UnitVariantAttributeLineDTO {
  id: number;
  position: number;
  content: string;
}

export interface RangedWeaponDTO {
  id: number;
  weaponSlot: string;
  imbuementVariantId: number | null;
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

export interface FactionVariantDTO {
  id: number;
  factionId: number;
  gameVersionId: number;
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

export interface AbilityVariantDTO {
  id: number;
  abilityId: number;
  name: string;
  slug: string;
  type: AbilityType;
  gameVersionId: number;
  description: string | null;
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

export interface AbilityVariantSummaryDTO {
  id: number;
  abilityId: number;
  name: string;
  slug: string;
  type: AbilityType;
  gameVersionId: number;
}

export interface SpellVariantDTO {
  id: number;
  spellId: number;
  name: string;
  slug: string;
  type: AbilityType;
  loreId: number;
  gameVersionId: number;
  description: string | null;
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

export interface SpellVariantSummaryDTO {
  id: number;
  spellId: number;
  name: string;
  slug: string;
  type: AbilityType;
  loreId: number;
  gameVersionId: number;
}

export interface ItemVariantDTO {
  id: number;
  itemId: number;
  name: string;
  slug: string;
  category: ItemCategory;
  rarity: ItemRarity;
  gameVersionId: number;
  picture: string | null;
  effect: string | null;
  raceId: number | null;
  abilityVariantIds: number[];
  spellVariantIds: number[];
}

export interface ItemVariantSummaryDTO {
  id: number;
  itemId: number;
  name: string;
  slug: string;
  category: ItemCategory;
  rarity: ItemRarity;
  gameVersionId: number;
  raceId: number | null;
}

export interface BuildingVariantDTO {
  id: number;
  buildingId: number;
  name: string;
  slug: string;
  category: BuildingCategory;
  raceId: number;
  buildingChainId: number | null;
  gameVersionId: number;
  picture: string | null;
  tier: number | null;
  effect: string | null;
  cost: number | null;
  requirements: string | null;
}

export interface BuildingVariantSummaryDTO {
  id: number;
  buildingId: number;
  name: string;
  slug: string;
  category: BuildingCategory;
  raceId: number;
  buildingChainId: number | null;
  gameVersionId: number;
  tier: number | null;
}

export interface UnitVariantSummaryDTO {
  id: number;
  unitId: number;
  name: string;
  slug: string;
  gameVersionId: number;
  picture: string | null;
  tier: number;
  category: string | null;
  categoryType: UnitCategoryType;
  role: UnitRole;
}

export interface UnitVariantDTO {
  id: number;
  unitId: number;
  name: string;
  slug: string;
  gameVersionId: number;
  displayName: string | null;
  raceIds: number[];
  picture: string | null;
  tier: number;
  category: string | null;
  categoryType: UnitCategoryType;
  role: UnitRole;
  description: string | null;
  size: string;
  entities: number | null;
  mass: number | null;
  campaignCost: number | null;
  baseUpkeep: number | null;
  multiplayerCost: number | null;
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
  speed: number | null;
  chargeSpeed: number | null;
  meleeAttack: number | null;
  meleeImbuement: ImbuementVariantDTO | null;
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
  rangedMode: RangedMode;
  rangedWeapons: RangedWeaponDTO[];
  unlockBuildingVariantId: number | null;
  allowBuildingVariantId: number | null;
  attributeLines: UnitVariantAttributeLineDTO[];
  unitAttributes: UnitAttributeVariantDTO[];
  abilities: AbilityVariantSummaryDTO[];
  passiveAbilities: AbilityVariantSummaryDTO[];
  spells: SpellVariantSummaryDTO[];
  items: ItemVariantSummaryDTO[];
  abilityVariantIds: number[];
  passiveAbilityVariantIds: number[];
  spellVariantIds: number[];
  itemVariantIds: number[];
  unitAttributeIds: number[];
  meleeImbuementVariantId: number | null;
  unlockBuildingId: number | null;
  allowBuildingId: number | null;
}

import {
  RaceDTO,
  RaceSummaryDTO,
  FactionDTO,
  FactionSummaryDTO,
  UnitDTO,
  UnitSummaryDTO,
  UnitRole,
  UnitCategoryType,
  AbilityDTO,
  AbilitySummaryDTO,
  AbilityType,
  SpellDTO,
  SpellSummaryDTO,
  LoreOfMagicDTO,
  LoreOfMagicSummaryDTO,
  ItemDTO,
  ItemSummaryDTO,
  ItemCategory,
  BuildingDTO,
  BuildingSummaryDTO,
  BuildingChainDTO,
  BuildingChainSummaryDTO,
  BuildingCategory,
  ImbuementDTO,
  UnitAttributeDTO,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

// ============================================================
// Races
// ============================================================

export const api = {
  races: {
    findAll: () => request<RaceSummaryDTO[]>("/races"),
    findBySlug: (slug: string) => request<RaceDTO>(`/races/${slug}`),
    create: (dto: Omit<RaceDTO, "id">) =>
      request<RaceDTO>("/races", { method: "POST", body: JSON.stringify(dto) }),
    update: (id: number, dto: Omit<RaceDTO, "id">) =>
      request<RaceDTO>(`/races/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) => request<void>(`/races/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Factions
  // ============================================================

  factions: {
    findAll: () => request<FactionSummaryDTO[]>("/factions"),
    findByRace: (raceId: number) =>
      request<FactionSummaryDTO[]>(`/factions/race/${raceId}`),
    findBySlug: (slug: string) => request<FactionDTO>(`/factions/${slug}`),
    create: (dto: Omit<FactionDTO, "id">) =>
      request<FactionDTO>("/factions", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<FactionDTO, "id">) =>
      request<FactionDTO>(`/factions/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/factions/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Units
  // ============================================================

  units: {
    findAll: () => request<UnitSummaryDTO[]>("/units"),
    findByRace: (raceId: number) =>
      request<UnitSummaryDTO[]>(`/units?raceId=${raceId}`),
    findByRaceAndRole: (raceId: number, role: UnitRole) =>
      request<UnitSummaryDTO[]>(`/units?raceId=${raceId}&role=${role}`),
    findByRaceAndCategoryType: (
      raceId: number,
      categoryType: UnitCategoryType,
    ) =>
      request<UnitSummaryDTO[]>(
        `/units?raceId=${raceId}&categoryType=${categoryType}`,
      ),
    findByUnlockBuilding: (buildingId: number) =>
      request<UnitSummaryDTO[]>(`/units/unlock-building/${buildingId}`),
    findByAllowBuilding: (buildingId: number) =>
      request<UnitSummaryDTO[]>(`/units/allow-building/${buildingId}`),
    findBySlug: (slug: string) => request<UnitDTO>(`/units/${slug}`),
    create: (dto: Omit<UnitDTO, "id">) =>
      request<UnitDTO>("/units", { method: "POST", body: JSON.stringify(dto) }),
    update: (id: number, dto: Omit<UnitDTO, "id">) =>
      request<UnitDTO>(`/units/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) => request<void>(`/units/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Abilities
  // ============================================================

  abilities: {
    findAll: () => request<AbilitySummaryDTO[]>("/abilities"),
    findByType: (type: AbilityType) =>
      request<AbilitySummaryDTO[]>(`/abilities?type=${type}`),
    findBySlug: (slug: string) => request<AbilityDTO>(`/abilities/${slug}`),
    create: (dto: Omit<AbilityDTO, "id">) =>
      request<AbilityDTO>("/abilities", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<AbilityDTO, "id">) =>
      request<AbilityDTO>(`/abilities/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/abilities/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Spells
  // ============================================================

  spells: {
    findAll: () => request<SpellSummaryDTO[]>("/spells"),
    findByLore: (loreId: number) =>
      request<SpellSummaryDTO[]>(`/spells/lore/${loreId}`),
    findBySlug: (slug: string) => request<SpellDTO>(`/spells/${slug}`),
    create: (dto: Omit<SpellDTO, "id">) =>
      request<SpellDTO>("/spells", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<SpellDTO, "id">) =>
      request<SpellDTO>(`/spells/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/spells/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Lores of Magic
  // ============================================================

  lores: {
    findAll: () => request<LoreOfMagicSummaryDTO[]>("/lores"),
    findBySlug: (slug: string) => request<LoreOfMagicDTO>(`/lores/${slug}`),
    create: (dto: Omit<LoreOfMagicDTO, "id">) =>
      request<LoreOfMagicDTO>("/lores", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<LoreOfMagicDTO, "id">) =>
      request<LoreOfMagicDTO>(`/lores/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) => request<void>(`/lores/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Items
  // ============================================================

  items: {
    findAll: () => request<ItemSummaryDTO[]>("/items"),
    findByCategory: (category: ItemCategory) =>
      request<ItemSummaryDTO[]>(`/items?category=${category}`),
    findByRace: (raceId: number) =>
      request<ItemSummaryDTO[]>(`/items?raceId=${raceId}`),
    findBySlug: (slug: string) => request<ItemDTO>(`/items/${slug}`),
    create: (dto: Omit<ItemDTO, "id">) =>
      request<ItemDTO>("/items", { method: "POST", body: JSON.stringify(dto) }),
    update: (id: number, dto: Omit<ItemDTO, "id">) =>
      request<ItemDTO>(`/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) => request<void>(`/items/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Buildings
  // ============================================================

  buildings: {
    findAll: () => request<BuildingSummaryDTO[]>("/buildings"),
    findByRace: (raceId: number) =>
      request<BuildingSummaryDTO[]>(`/buildings?raceId=${raceId}`),
    findByChain: (chainId: number) =>
      request<BuildingSummaryDTO[]>(`/buildings?chainId=${chainId}`),
    findBySlug: (slug: string) => request<BuildingDTO>(`/buildings/${slug}`),
    create: (dto: Omit<BuildingDTO, "id">) =>
      request<BuildingDTO>("/buildings", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<BuildingDTO, "id">) =>
      request<BuildingDTO>(`/buildings/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/buildings/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Building Chains
  // ============================================================

  buildingChains: {
    findAll: () => request<BuildingChainSummaryDTO[]>("/building-chains"),
    findByRace: (raceId: number) =>
      request<BuildingChainSummaryDTO[]>(`/building-chains?raceId=${raceId}`),
    findByRaceAndCategory: (raceId: number, category: BuildingCategory) =>
      request<BuildingChainSummaryDTO[]>(
        `/building-chains?raceId=${raceId}&category=${category}`,
      ),
    findBySlug: (slug: string) =>
      request<BuildingChainDTO>(`/building-chains/${slug}`),
    create: (dto: Omit<BuildingChainDTO, "id">) =>
      request<BuildingChainDTO>("/building-chains", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<BuildingChainDTO, "id">) =>
      request<BuildingChainDTO>(`/building-chains/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/building-chains/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Imbuements
  // ============================================================

  imbuements: {
    findAll: () => request<ImbuementDTO[]>("/imbuements"),
    findById: (id: number) => request<ImbuementDTO>(`/imbuements/${id}`),
    create: (dto: Omit<ImbuementDTO, "id">) =>
      request<ImbuementDTO>("/imbuements", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<ImbuementDTO, "id">) =>
      request<ImbuementDTO>(`/imbuements/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/imbuements/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Unit Attributes
  // ============================================================

  unitAttributes: {
    findAll: () => request<UnitAttributeDTO[]>("/unit-attributes"),
    findById: (id: number) =>
      request<UnitAttributeDTO>(`/unit-attributes/${id}`),
    create: (dto: Omit<UnitAttributeDTO, "id">) =>
      request<UnitAttributeDTO>("/unit-attributes", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<UnitAttributeDTO, "id">) =>
      request<UnitAttributeDTO>(`/unit-attributes/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/unit-attributes/${id}`, { method: "DELETE" }),
  },
};

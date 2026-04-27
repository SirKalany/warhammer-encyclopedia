import {
  GameVersionDTO,
  RaceDTO,
  RaceSummaryDTO,
  LoreOfMagicDTO,
  LoreOfMagicSummaryDTO,
  AbilityDTO,
  AbilitySummaryDTO,
  AbilityType,
  SpellDTO,
  SpellSummaryDTO,
  ItemDTO,
  ItemSummaryDTO,
  ItemCategory,
  ImbuementDTO,
  UnitAttributeDTO,
  FactionDTO,
  FactionSummaryDTO,
  BuildingChainDTO,
  BuildingChainSummaryDTO,
  BuildingCategory,
  BuildingDTO,
  BuildingSummaryDTO,
  UnitDTO,
  UnitSummaryDTO,
  FactionVariantDTO,
  AbilityVariantDTO,
  AbilityVariantSummaryDTO,
  SpellVariantDTO,
  SpellVariantSummaryDTO,
  ItemVariantDTO,
  ItemVariantSummaryDTO,
  ImbuementVariantDTO,
  UnitAttributeVariantDTO,
  BuildingVariantDTO,
  BuildingVariantSummaryDTO,
  UnitVariantDTO,
  UnitVariantSummaryDTO,
  UnitRole,
  UnitCategoryType,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  // ============================================================
  // Game Versions
  // ============================================================
  versions: {
    findAll: () => request<GameVersionDTO[]>("/versions"),
    findBySlug: (slug: string) => request<GameVersionDTO>(`/versions/${slug}`),
    create: (dto: Omit<GameVersionDTO, "id">) =>
      request<GameVersionDTO>("/versions", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<GameVersionDTO, "id">) =>
      request<GameVersionDTO>(`/versions/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/versions/${id}`, { method: "DELETE" }),
  },

  // ============================================================
  // Identity
  // ============================================================
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

  abilities: {
    findAll: (type?: AbilityType) =>
      request<AbilitySummaryDTO[]>(
        type ? `/abilities?type=${type}` : "/abilities",
      ),
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

  spells: {
    findAll: (loreId?: number) =>
      request<SpellSummaryDTO[]>(
        loreId ? `/spells?loreId=${loreId}` : "/spells",
      ),
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

  items: {
    findAll: (category?: ItemCategory) =>
      request<ItemSummaryDTO[]>(
        category ? `/items?category=${category}` : "/items",
      ),
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

  imbuements: {
    findAll: () => request<ImbuementDTO[]>("/imbuements"),
    findBySlug: (slug: string) => request<ImbuementDTO>(`/imbuements/${slug}`),
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

  factions: {
    findAll: (raceId?: number) =>
      request<FactionSummaryDTO[]>(
        raceId ? `/factions?raceId=${raceId}` : "/factions",
      ),
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

  buildingChains: {
    findAll: (raceId?: number, category?: BuildingCategory) => {
      const params = new URLSearchParams();
      if (raceId) params.set("raceId", String(raceId));
      if (category) params.set("category", category);
      const query = params.toString();
      return request<BuildingChainSummaryDTO[]>(
        `/building-chains${query ? `?${query}` : ""}`,
      );
    },
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

  buildings: {
    findAll: (raceId?: number, chainId?: number) => {
      const params = new URLSearchParams();
      if (raceId) params.set("raceId", String(raceId));
      if (chainId) params.set("chainId", String(chainId));
      const query = params.toString();
      return request<BuildingSummaryDTO[]>(
        `/buildings${query ? `?${query}` : ""}`,
      );
    },
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

  units: {
    findAll: (raceId?: number) =>
      request<UnitSummaryDTO[]>(raceId ? `/units?raceId=${raceId}` : "/units"),
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
  // Variants
  // ============================================================
  raceVariants: {
    findByVersion: (versionId: number) =>
      request<RaceSummaryDTO[]>(`/variants/races?versionId=${versionId}`),
    addToVersion: (raceId: number, versionId: number) =>
      request<void>(`/variants/races/${raceId}/versions/${versionId}`, {
        method: "POST",
      }),
    removeFromVersion: (raceId: number, versionId: number) =>
      request<void>(`/variants/races/${raceId}/versions/${versionId}`, {
        method: "DELETE",
      }),
  },

  factionVariants: {
    findByVersion: (versionId: number, raceId?: number) => {
      const params = new URLSearchParams({ versionId: String(versionId) });
      if (raceId) params.set("raceId", String(raceId));
      return request<FactionVariantDTO[]>(`/variants/factions?${params}`);
    },
    findByFactionAndVersion: (factionId: number, versionId: number) =>
      request<FactionVariantDTO>(
        `/variants/factions/faction/${factionId}?versionId=${versionId}`,
      ),
    create: (dto: Omit<FactionVariantDTO, "id">) =>
      request<FactionVariantDTO>("/variants/factions", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<FactionVariantDTO, "id">) =>
      request<FactionVariantDTO>(`/variants/factions/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/factions/${id}`, { method: "DELETE" }),
  },

  abilityVariants: {
    findByVersion: (versionId: number, type?: AbilityType) => {
      const params = new URLSearchParams({ versionId: String(versionId) });
      if (type) params.set("type", type);
      return request<AbilityVariantSummaryDTO[]>(
        `/variants/abilities?${params}`,
      );
    },
    findByAbilityAndVersion: (abilityId: number, versionId: number) =>
      request<AbilityVariantDTO>(
        `/variants/abilities/ability/${abilityId}?versionId=${versionId}`,
      ),
    create: (dto: Omit<AbilityVariantDTO, "id">) =>
      request<AbilityVariantDTO>("/variants/abilities", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<AbilityVariantDTO, "id">) =>
      request<AbilityVariantDTO>(`/variants/abilities/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/abilities/${id}`, { method: "DELETE" }),
  },

  spellVariants: {
    findByVersion: (versionId: number, loreId?: number) => {
      const params = new URLSearchParams({ versionId: String(versionId) });
      if (loreId) params.set("loreId", String(loreId));
      return request<SpellVariantSummaryDTO[]>(`/variants/spells?${params}`);
    },
    findBySpellAndVersion: (spellId: number, versionId: number) =>
      request<SpellVariantDTO>(
        `/variants/spells/spell/${spellId}?versionId=${versionId}`,
      ),
    create: (dto: Omit<SpellVariantDTO, "id">) =>
      request<SpellVariantDTO>("/variants/spells", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<SpellVariantDTO, "id">) =>
      request<SpellVariantDTO>(`/variants/spells/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/spells/${id}`, { method: "DELETE" }),
  },

  itemVariants: {
    findByVersion: (versionId: number, raceId?: number) => {
      const params = new URLSearchParams({ versionId: String(versionId) });
      if (raceId) params.set("raceId", String(raceId));
      return request<ItemVariantSummaryDTO[]>(`/variants/items?${params}`);
    },
    findByItemAndVersion: (itemId: number, versionId: number) =>
      request<ItemVariantDTO>(
        `/variants/items/item/${itemId}?versionId=${versionId}`,
      ),
    create: (dto: Omit<ItemVariantDTO, "id">) =>
      request<ItemVariantDTO>("/variants/items", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<ItemVariantDTO, "id">) =>
      request<ItemVariantDTO>(`/variants/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/items/${id}`, { method: "DELETE" }),
  },

  imbuementVariants: {
    findByVersion: (versionId: number) =>
      request<ImbuementVariantDTO[]>(
        `/variants/imbuements?versionId=${versionId}`,
      ),
    findByImbuementAndVersion: (imbuementId: number, versionId: number) =>
      request<ImbuementVariantDTO>(
        `/variants/imbuements/imbuement/${imbuementId}?versionId=${versionId}`,
      ),
    create: (dto: Omit<ImbuementVariantDTO, "id">) =>
      request<ImbuementVariantDTO>("/variants/imbuements", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<ImbuementVariantDTO, "id">) =>
      request<ImbuementVariantDTO>(`/variants/imbuements/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/imbuements/${id}`, { method: "DELETE" }),
  },

  unitAttributeVariants: {
    findByVersion: (versionId: number) =>
      request<UnitAttributeVariantDTO[]>(
        `/variants/unit-attributes?versionId=${versionId}`,
      ),
    findByAttributeAndVersion: (attributeId: number, versionId: number) =>
      request<UnitAttributeVariantDTO>(
        `/variants/unit-attributes/attribute/${attributeId}?versionId=${versionId}`,
      ),
    create: (dto: Omit<UnitAttributeVariantDTO, "id">) =>
      request<UnitAttributeVariantDTO>("/variants/unit-attributes", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<UnitAttributeVariantDTO, "id">) =>
      request<UnitAttributeVariantDTO>(`/variants/unit-attributes/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/unit-attributes/${id}`, { method: "DELETE" }),
  },

  buildingVariants: {
    findByVersion: (versionId: number, raceId?: number, chainId?: number) => {
      const params = new URLSearchParams({ versionId: String(versionId) });
      if (raceId) params.set("raceId", String(raceId));
      if (chainId) params.set("chainId", String(chainId));
      return request<BuildingVariantSummaryDTO[]>(
        `/variants/buildings?${params}`,
      );
    },
    findByBuildingAndVersion: (buildingId: number, versionId: number) =>
      request<BuildingVariantDTO>(
        `/variants/buildings/building/${buildingId}?versionId=${versionId}`,
      ),
    create: (dto: Omit<BuildingVariantDTO, "id">) =>
      request<BuildingVariantDTO>("/variants/buildings", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<BuildingVariantDTO, "id">) =>
      request<BuildingVariantDTO>(`/variants/buildings/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/buildings/${id}`, { method: "DELETE" }),
  },

  unitVariants: {
    findByVersion: (
      versionId: number,
      raceId?: number,
      role?: UnitRole,
      categoryType?: UnitCategoryType,
    ) => {
      const params = new URLSearchParams({ versionId: String(versionId) });
      if (raceId) params.set("raceId", String(raceId));
      if (role) params.set("role", role);
      if (categoryType) params.set("categoryType", categoryType);
      return request<UnitVariantSummaryDTO[]>(`/variants/units?${params}`);
    },
    findByUnitAndVersion: (unitId: number, versionId: number) =>
      request<UnitVariantDTO>(
        `/variants/units/unit/${unitId}?versionId=${versionId}`,
      ),
    findByUnlockBuilding: (buildingVariantId: number) =>
      request<UnitVariantSummaryDTO[]>(
        `/variants/units/unlock-building/${buildingVariantId}`,
      ),
    findByAllowBuilding: (buildingVariantId: number) =>
      request<UnitVariantSummaryDTO[]>(
        `/variants/units/allow-building/${buildingVariantId}`,
      ),
    create: (dto: Omit<UnitVariantDTO, "id">) =>
      request<UnitVariantDTO>("/variants/units", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: number, dto: Omit<UnitVariantDTO, "id">) =>
      request<UnitVariantDTO>(`/variants/units/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
      }),
    delete: (id: number) =>
      request<void>(`/variants/units/${id}`, { method: "DELETE" }),
  },
};

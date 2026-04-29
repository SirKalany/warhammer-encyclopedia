"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { FactionSummaryDTO, GameVersionDTO, ClimateStatus } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminSelect,
  AdminCheckbox,
} from "@/components/admin/AdminFormField";

const CLIMATE_KEYS = [
  "climateChaoticWasteland",
  "climateFrozen",
  "climateMountain",
  "climateTemperate",
  "climateTemperateIsland",
  "climateMagicalForest",
  "climateJungle",
  "climateSavannah",
  "climateDesert",
  "climateWasteland",
  "climateOcean",
] as const;

const CLIMATE_LABELS: Record<string, string> = {
  climateChaoticWasteland: "Chaotic Wasteland",
  climateFrozen: "Frozen",
  climateMountain: "Mountain",
  climateTemperate: "Temperate",
  climateTemperateIsland: "Temperate Island",
  climateMagicalForest: "Magical Forest",
  climateJungle: "Jungle",
  climateSavannah: "Savannah",
  climateDesert: "Desert",
  climateWasteland: "Wasteland",
  climateOcean: "Ocean",
};

const CLIMATE_OPTIONS = [
  { value: "HABITABLE", label: "Habitable" },
  { value: "UNPLEASANT", label: "Unpleasant" },
  { value: "UNINHABITABLE", label: "Uninhabitable" },
];

type ClimateForm = Record<(typeof CLIMATE_KEYS)[number], ClimateStatus>;

const DEFAULT_CLIMATES: ClimateForm = {
  climateChaoticWasteland: "HABITABLE",
  climateFrozen: "HABITABLE",
  climateMountain: "HABITABLE",
  climateTemperate: "HABITABLE",
  climateTemperateIsland: "HABITABLE",
  climateMagicalForest: "HABITABLE",
  climateJungle: "HABITABLE",
  climateSavannah: "HABITABLE",
  climateDesert: "HABITABLE",
  climateWasteland: "HABITABLE",
  climateOcean: "HABITABLE",
};

interface FactionVariantFormProps {
  id?: number;
}

export default function FactionVariantForm({ id }: FactionVariantFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [factions, setFactions] = useState<FactionSummaryDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [form, setForm] = useState({
    factionId: "",
    gameVersionId: "",
    banner: "",
    leader: "",
    factionEffect: "",
    isHorde: false,
    ...DEFAULT_CLIMATES,
  });

  useEffect(() => {
    Promise.all([api.factions.findAll(), api.versions.findAll()]).then(
      ([factions, versions]) => {
        setFactions(factions);
        setVersions(versions);
      },
    );
    if (isEdit) {
      // Find variant by id across all versions
      api.versions.findAll().then((versions) => {
        Promise.all(
          versions.map((v) => api.factionVariants.findByVersion(v.id)),
        ).then((results) => {
          const variant = results.flat().find((fv) => fv.id === id);
          if (variant) {
            setForm({
              factionId: String(variant.factionId),
              gameVersionId: String(variant.gameVersionId),
              banner: variant.banner ?? "",
              leader: variant.leader ?? "",
              factionEffect: variant.factionEffect ?? "",
              isHorde: variant.isHorde,
              climateChaoticWasteland: variant.climateChaoticWasteland,
              climateFrozen: variant.climateFrozen,
              climateMountain: variant.climateMountain,
              climateTemperate: variant.climateTemperate,
              climateTemperateIsland: variant.climateTemperateIsland,
              climateMagicalForest: variant.climateMagicalForest,
              climateJungle: variant.climateJungle,
              climateSavannah: variant.climateSavannah,
              climateDesert: variant.climateDesert,
              climateWasteland: variant.climateWasteland,
              climateOcean: variant.climateOcean,
            });
          }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        factionId: Number(form.factionId),
        gameVersionId: Number(form.gameVersionId),
        banner: form.banner || null,
        leader: form.leader || null,
        factionEffect: form.factionEffect || null,
        isHorde: form.isHorde,
        climateChaoticWasteland: form.climateChaoticWasteland,
        climateFrozen: form.climateFrozen,
        climateMountain: form.climateMountain,
        climateTemperate: form.climateTemperate,
        climateTemperateIsland: form.climateTemperateIsland,
        climateMagicalForest: form.climateMagicalForest,
        climateJungle: form.climateJungle,
        climateSavannah: form.climateSavannah,
        climateDesert: form.climateDesert,
        climateWasteland: form.climateWasteland,
        climateOcean: form.climateOcean,
      };
      if (isEdit) await api.factionVariants.update(id, payload);
      else await api.factionVariants.create(payload);
      router.push("/admin/faction-variants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Faction Variant" : "New Faction Variant"}
      backHref="/admin/faction-variants"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Faction" required>
          <AdminSelect
            value={form.factionId}
            onChange={set("factionId")}
            placeholder="Select faction..."
            options={factions.map((f) => ({
              value: String(f.id),
              label: f.name,
            }))}
            required
          />
        </AdminFormField>
        <AdminFormField label="Game Version" required>
          <AdminSelect
            value={form.gameVersionId}
            onChange={set("gameVersionId")}
            placeholder="Select version..."
            options={versions.map((v) => ({
              value: String(v.id),
              label: v.name,
            }))}
            required
          />
        </AdminFormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Banner" hint="Path to banner image">
          <AdminInput
            value={form.banner}
            onChange={set("banner")}
            placeholder="/images/factions/empire.webp"
          />
        </AdminFormField>
        <AdminFormField label="Leader">
          <AdminInput
            value={form.leader}
            onChange={set("leader")}
            placeholder="e.g. Karl Franz"
          />
        </AdminFormField>
      </div>

      <AdminFormField label="Faction Effect">
        <AdminInput
          value={form.factionEffect}
          onChange={set("factionEffect")}
          placeholder="e.g. +10% campaign movement range"
        />
      </AdminFormField>

      <AdminCheckbox
        label="Is Horde"
        checked={form.isHorde}
        onChange={(e) => setForm((p) => ({ ...p, isHorde: e.target.checked }))}
      />

      <div className="space-y-2">
        <p className="font-display text-xs tracking-widest uppercase text-text-muted">
          Climates
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CLIMATE_KEYS.map((key) => (
            <AdminFormField key={key} label={CLIMATE_LABELS[key]}>
              <AdminSelect
                value={form[key]}
                onChange={set(key)}
                options={CLIMATE_OPTIONS}
              />
            </AdminFormField>
          ))}
        </div>
      </div>
    </AdminFormWrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ImbuementDTO, GameVersionDTO } from "@/lib/types";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/components/admin/AdminFormField";

interface ImbuementVariantFormProps {
  id?: number;
}

export default function ImbuementVariantForm({
  id,
}: ImbuementVariantFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [imbuements, setImbuements] = useState<ImbuementDTO[]>([]);
  const [versions, setVersions] = useState<GameVersionDTO[]>([]);
  const [form, setForm] = useState({
    imbuementId: "",
    gameVersionId: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    Promise.all([api.imbuements.findAll(), api.versions.findAll()]).then(
      ([imbuements, versions]) => {
        setImbuements(imbuements);
        setVersions(versions);
      },
    );
    if (isEdit) {
      api.versions.findAll().then((versions) => {
        Promise.all(
          versions.map((v) => api.imbuementVariants.findByVersion(v.id)),
        ).then((results) => {
          const variant = results.flat().find((iv) => iv.id === id);
          if (variant) {
            setForm({
              imbuementId: String(variant.imbuementId),
              gameVersionId: String(variant.gameVersionId),
              description: variant.description ?? "",
              icon: variant.icon ?? "",
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
      const imbuement = imbuements.find(
        (i) => i.id === Number(form.imbuementId),
      );
      const payload = {
        imbuementId: Number(form.imbuementId),
        name: imbuement?.name ?? "",
        slug: imbuement?.slug ?? "",
        gameVersionId: Number(form.gameVersionId),
        description: form.description || null,
        icon: form.icon || null,
      };
      if (isEdit) await api.imbuementVariants.update(id, payload);
      else await api.imbuementVariants.create(payload);
      router.push("/admin/imbuement-variants");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Imbuement Variant" : "New Imbuement Variant"}
      backHref="/admin/imbuement-variants"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField label="Imbuement" required>
          <AdminSelect
            value={form.imbuementId}
            onChange={set("imbuementId")}
            placeholder="Select imbuement..."
            options={imbuements.map((i) => ({
              value: String(i.id),
              label: i.name,
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
      <AdminFormField label="Description">
        <AdminTextarea
          value={form.description}
          onChange={set("description")}
          placeholder="What this imbuement does..."
        />
      </AdminFormField>
      <AdminFormField
        label="Icon"
        hint="Path to icon image e.g. /images/imbuements/poison.webp"
      >
        <AdminInput
          value={form.icon}
          onChange={set("icon")}
          placeholder="/images/imbuements/poison.webp"
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

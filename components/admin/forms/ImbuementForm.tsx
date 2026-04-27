"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import {
  AdminFormField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminFormField";

interface ImbuementFormProps {
  id?: number;
}

export default function ImbuementForm({ id }: ImbuementFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", icon: "" });

  useEffect(() => {
    if (isEdit) {
      api.imbuements.findById(id).then((i) => {
        setForm({
          name: i.name,
          description: i.description ?? "",
          icon: i.icon ?? "",
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.imbuements.update(id, form);
      } else {
        await api.imbuements.create(form);
      }
      router.push("/admin/imbuements");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Imbuement" : "New Imbuement"}
      backHref="/admin/imbuements"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <AdminFormField label="Name" required>
        <AdminInput
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="e.g. Poison"
          required
        />
      </AdminFormField>
      <AdminFormField label="Description">
        <AdminTextarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="What this imbuement does..."
        />
      </AdminFormField>
      <AdminFormField
        label="Icon"
        hint="Path to icon image e.g. /images/imbuements/poison.webp"
      >
        <AdminInput
          value={form.icon}
          onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
          placeholder="/images/imbuements/poison.webp"
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

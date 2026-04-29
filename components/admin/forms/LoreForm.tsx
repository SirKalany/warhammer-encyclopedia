"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import { AdminFormField, AdminInput } from "@/components/admin/AdminFormField";

interface LoreFormProps {
  id?: number;
}

export default function LoreForm({ id }: LoreFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  useEffect(() => {
    if (isEdit) {
      api.lores.findAll().then((lores) => {
        const l = lores.find((l) => l.id === id);
        if (l) setForm({ name: l.name, slug: l.slug });
      });
    }
  }, [id, isEdit]);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit
        ? prev.slug
        : name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) await api.lores.update(id, form);
      else await api.lores.create(form);
      router.push("/admin/lores");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Lore" : "New Lore"}
      backHref="/admin/lores"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <AdminFormField label="Name" required>
        <AdminInput
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Lore of Fire"
          required
        />
      </AdminFormField>
      <AdminFormField label="Slug" required hint="Auto-generated from name.">
        <AdminInput
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="e.g. lore-of-fire"
          required
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

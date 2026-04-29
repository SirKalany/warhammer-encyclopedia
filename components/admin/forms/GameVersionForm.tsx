"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import { AdminFormField, AdminInput } from "@/components/admin/AdminFormField";

interface GameVersionFormProps {
  id?: number;
}

export default function GameVersionForm({ id }: GameVersionFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", icon: "" });

  useEffect(() => {
    if (isEdit) {
      api.versions.findAll().then((versions) => {
        const v = versions.find((v) => v.id === id);
        if (v) setForm({ name: v.name, slug: v.slug, icon: v.icon ?? "" });
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
      const payload = {
        name: form.name,
        slug: form.slug,
        icon: form.icon || null,
      };
      if (isEdit) await api.versions.update(id, payload);
      else await api.versions.create(payload);
      router.push("/admin/versions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Version" : "New Version"}
      backHref="/admin/versions"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <AdminFormField label="Name" required>
        <AdminInput
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Vanilla"
          required
        />
      </AdminFormField>
      <AdminFormField label="Slug" required hint="Auto-generated from name.">
        <AdminInput
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="e.g. vanilla"
          required
        />
      </AdminFormField>
      <AdminFormField
        label="Icon"
        hint="Path to icon image e.g. /images/versions/vanilla.webp"
      >
        <AdminInput
          value={form.icon}
          onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
          placeholder="/images/versions/vanilla.webp"
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

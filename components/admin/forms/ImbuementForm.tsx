"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import { AdminFormField, AdminInput } from "@/components/admin/AdminFormField";

interface ImbuementFormProps {
  id?: number;
}

export default function ImbuementForm({ id }: ImbuementFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  useEffect(() => {
    if (isEdit) {
      api.imbuements.findAll().then((imbuements) => {
        const i = imbuements.find((i) => i.id === id);
        if (i) setForm({ name: i.name, slug: i.slug });
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
      if (isEdit) await api.imbuements.update(id, form);
      else await api.imbuements.create(form);
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
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Poison"
          required
        />
      </AdminFormField>
      <AdminFormField label="Slug" required hint="Auto-generated from name.">
        <AdminInput
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="e.g. poison"
          required
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AdminFormWrapper from "@/components/admin/AdminFormWrapper";
import { AdminFormField, AdminInput } from "@/components/admin/AdminFormField";

interface RaceFormProps {
  id?: number;
}

export default function RaceForm({ id }: RaceFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  useEffect(() => {
    if (isEdit) {
      api.races.findAll().then((races) => {
        const r = races.find((r) => r.id === id);
        if (r) setForm({ name: r.name, slug: r.slug });
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
      if (isEdit) await api.races.update(id, form);
      else await api.races.create(form);
      router.push("/admin/races");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Race" : "New Race"}
      backHref="/admin/races"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <AdminFormField label="Name" required>
        <AdminInput
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Greenskins"
          required
        />
      </AdminFormField>
      <AdminFormField label="Slug" required hint="Auto-generated from name.">
        <AdminInput
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="e.g. greenskins"
          required
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

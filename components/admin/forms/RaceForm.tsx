"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { RaceDTO } from "@/lib/types";
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
      // Find by id — fetch all and filter since we don't have findById for races
      api.races.findAll().then((races) => {
        const race = races.find((r) => r.id === id);
        if (race) setForm({ name: race.name, slug: race.slug });
      });
    }
  }, [id, isEdit]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setForm((prev) => ({
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
      if (isEdit) {
        await api.races.update(id, form);
      } else {
        await api.races.create(form);
      }
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

      <AdminFormField
        label="Slug"
        required
        hint="Auto-generated from name. Used in URLs."
      >
        <AdminInput
          value={form.slug}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, slug: e.target.value }))
          }
          placeholder="e.g. greenskins"
          required
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

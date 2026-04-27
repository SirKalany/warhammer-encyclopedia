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

interface UnitAttributeFormProps {
  id?: number;
}

export default function UnitAttributeForm({ id }: UnitAttributeFormProps) {
  const router = useRouter();
  const isEdit = id !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (isEdit) {
      api.unitAttributes.findById(id).then((a) => {
        setForm({ name: a.name, description: a.description ?? "" });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.unitAttributes.update(id, form);
      } else {
        await api.unitAttributes.create(form);
      }
      router.push("/admin/unit-attributes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminFormWrapper
      title={isEdit ? "Edit Unit Attribute" : "New Unit Attribute"}
      backHref="/admin/unit-attributes"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <AdminFormField label="Name" required>
        <AdminInput
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="e.g. Flying"
          required
        />
      </AdminFormField>
      <AdminFormField label="Description">
        <AdminTextarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="What this attribute means..."
        />
      </AdminFormField>
    </AdminFormWrapper>
  );
}

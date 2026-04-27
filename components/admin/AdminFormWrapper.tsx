"use client";

import Link from "next/link";

interface AdminFormWrapperProps {
  title: string;
  backHref: string;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function AdminFormWrapper({
  title,
  backHref,
  onSubmit,
  isLoading,
  children,
}: AdminFormWrapperProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="
                        font-display text-[0.65rem] tracking-widest uppercase
                        px-3 py-1.5 border border-border-gold rounded-sm
                        text-text-muted hover:text-gold-bright hover:border-gold-mid
                        transition-all duration-150 no-underline
                    "
        >
          ← Back
        </Link>
        <h1 className="text-2xl">{title}</h1>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        {children}

        <div className="pt-2 border-t border-border-subtle">
          <button
            type="submit"
            disabled={isLoading}
            className="
                            font-display text-xs tracking-widest uppercase
                            px-6 py-2.5 bg-gold-subtle border border-gold-bright
                            text-gold-bright rounded-sm
                            hover:bg-gold-dim hover:text-text-primary
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-150
                        "
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

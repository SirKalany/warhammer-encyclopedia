"use client";

import Link from "next/link";

interface Column<T> {
  label: string;
  render: (item: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: number }> {
  items: T[];
  columns: Column<T>[];
  editPath: (item: T) => string;
  onDelete: (id: number) => void;
}

export default function AdminTable<T extends { id: number }>({
  items,
  columns,
  editPath,
  onDelete,
}: AdminTableProps<T>) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-bg-overlay border-b border-border-gold">
            {columns.map((col, i) => (
              <th
                key={i}
                className="
                                    px-4 py-3 text-left
                                    font-display text-xs tracking-widest uppercase
                                    text-text-muted font-semibold
                                "
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-display text-xs tracking-widest uppercase text-text-muted font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-8 text-center text-text-muted italic"
              >
                No entries yet.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border-subtle last:border-0 hover:bg-bg-raised transition-colors duration-150"
              >
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3 text-sm text-text-primary">
                    {col.render(item)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={editPath(item)}
                      className="
                                                font-display text-[0.65rem] tracking-widest uppercase
                                                px-3 py-1 border border-border-gold rounded-sm
                                                text-text-muted hover:text-gold-bright hover:border-gold-mid
                                                transition-all duration-150 no-underline
                                            "
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="
                                                font-display text-[0.65rem] tracking-widest uppercase
                                                px-3 py-1 border border-[#7c2a2a] rounded-sm
                                                text-[#c46a6a] hover:bg-[#2a1010]
                                                transition-all duration-150
                                            "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

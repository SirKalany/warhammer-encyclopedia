"use client";

interface DeleteModalProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  name,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="
                relative bg-bg-surface border border-border-gold
                rounded-md p-6 space-y-4 w-full max-w-md mx-4
            "
      >
        <h2 className="text-lg">Delete {name}?</h2>
        <p className="text-text-secondary text-sm">
          This action cannot be undone. The entry will be permanently removed.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="
                            font-display text-xs tracking-widest uppercase
                            px-4 py-2 bg-[#2a1010] border border-[#7c2a2a]
                            text-[#c46a6a] rounded-sm
                            hover:bg-[#3a1515]
                            transition-all duration-150
                        "
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="
                            font-display text-xs tracking-widest uppercase
                            px-4 py-2 bg-bg-raised border border-border-gold
                            text-text-muted rounded-sm
                            hover:text-gold-bright hover:border-gold-mid
                            transition-all duration-150
                        "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

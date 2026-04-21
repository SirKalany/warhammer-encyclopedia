interface BadgeProps {
  label: string;
  variant?: "default" | "gold" | "good" | "warn" | "bad";
}

const variants = {
  default: "bg-bg-overlay text-text-secondary border-border-subtle",
  gold: "bg-gold-subtle text-gold-bright border-gold-dim",
  good: "bg-[#1a2e1c] text-[#6aaa70] border-[#4a7c4e]",
  warn: "bg-[#2a2410] text-[#c4a84a] border-[#7c6b2a]",
  bad: "bg-[#2a1010] text-[#c46a6a] border-[#7c2a2a]",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`
            inline-block font-display text-[0.65rem] font-semibold
            tracking-widest uppercase px-2 py-0.5 rounded-sm border
            ${variants[variant]}
        `}
    >
      {label}
    </span>
  );
}

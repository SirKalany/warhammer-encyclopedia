import Link from "next/link";

interface AddButtonProps {
  href: string;
  label: string;
}

export default function AddButton({ href, label }: AddButtonProps) {
  return (
    <Link
      href={href}
      className="
                font-display text-xs tracking-widest uppercase
                px-4 py-2 bg-gold-subtle border border-gold-bright
                text-gold-bright rounded-sm
                hover:bg-gold-dim hover:text-text-primary
                transition-all duration-150 no-underline
            "
    >
      + {label}
    </Link>
  );
}

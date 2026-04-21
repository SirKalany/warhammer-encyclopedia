"use client";

import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-text-muted text-sm pointer-events-none">
        ⚔
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="
                    w-full bg-bg-raised border border-border-gold rounded-md
                    text-text-primary font-body text-base
                    pl-9 pr-4 py-2 outline-none
                    placeholder:text-text-muted
                    focus:border-gold-mid focus:ring-2 focus:ring-gold-subtle
                    transition-all duration-150
                "
      />
    </div>
  );
}

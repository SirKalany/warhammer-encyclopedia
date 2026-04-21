"use client";

import { RaceSummaryDTO } from "@/lib/types";

interface RacePickerProps {
  races: RaceSummaryDTO[];
  selectedId?: number;
  onSelect: (race: RaceSummaryDTO) => void;
}

export default function RacePicker({
  races,
  selectedId,
  onSelect,
}: RacePickerProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
      {races.map((race) => (
        <button
          key={race.id}
          onClick={() => onSelect(race)}
          className={`
                        border rounded-md p-4 text-center cursor-pointer
                        transition-all duration-150
                        ${
                          selectedId === race.id
                            ? "bg-gold-subtle border-gold-bright"
                            : "bg-bg-raised border-border-gold hover:bg-bg-overlay hover:border-gold-mid"
                        }
                    `}
        >
          <span className="font-display text-[0.8rem] font-semibold tracking-widest text-gold-bright uppercase">
            {race.name}
          </span>
        </button>
      ))}
    </div>
  );
}

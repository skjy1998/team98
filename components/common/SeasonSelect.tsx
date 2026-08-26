import type { TeamSeason } from "@/types/seasons";
import { ChevronDown } from "lucide-react";

interface SeasonSelectProps {
  seasons: TeamSeason[];
  selectedSeasonId?: string;
  ariaLabel: string;
  onChange: (seasonId: string) => void;
}

export default function SeasonSelect({
  seasons,
  selectedSeasonId,
  ariaLabel,
  onChange,
}: Readonly<SeasonSelectProps>) {
  return (
    <div className="relative">
      <select
        value={selectedSeasonId ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-xl border border-stone-200 bg-white pl-4 pr-10 text-sm font-semibold text-stone-700 outline-none transition focus:border-emerald-400"
        aria-label={ariaLabel}
      >
        {seasons.map((season) => (
          <option key={season.id} value={season.id}>
            {season.name}
            {season.isActive ? " (활성)" : ""}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
      />
    </div>
  );
}

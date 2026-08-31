import type { MatchPlayersPerSide } from "@/types/match";
import { ChevronDown } from "lucide-react";

interface TacticsPlayerCountSelectProps {
  options: readonly MatchPlayersPerSide[];
  value: MatchPlayersPerSide;
  onChange: (value: MatchPlayersPerSide) => void;
  isSaving?: boolean;
  canManage: boolean;
}

export default function TacticsPlayerCountSelect({
  options,
  value,
  onChange,
  isSaving = false,
  canManage,
}: Readonly<TacticsPlayerCountSelectProps>) {
  return (
    <div className="min-w-[180px]">
      <label
        htmlFor="player-count-select"
        className="mb-2 block text-sm font-medium text-stone-500"
      >
        경기 인원
      </label>

      <div className="relative">
        <select
          id="player-count-select"
          value={value}
          onChange={(event) =>
            onChange(Number(event.target.value) as MatchPlayersPerSide)
          }
          disabled={!canManage || isSaving}
          className={`h-14 w-full appearance-none rounded-xl border border-stone-200 px-5 pr-12 text-base font-semibold outline-none transition ${
            canManage && !isSaving
              ? "bg-stone-50 text-stone-800 focus:border-emerald-300 focus:bg-white"
              : "cursor-not-allowed bg-stone-100 text-stone-400"
          }`}
        >
          {options.map((count) => (
            <option key={count} value={count}>
              {count}대{count}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
      </div>
    </div>
  );
}

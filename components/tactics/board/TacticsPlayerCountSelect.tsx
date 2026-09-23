import type { MatchPlayersPerSide } from "@/types/match";
import { ChevronDown } from "lucide-react";
import TacticsMobileSelect from "./TacticsMobileSelect";

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
    <div className="min-w-0 sm:min-w-[180px]">
      <label
        htmlFor="player-count-select"
        className="mb-1.5 block text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm"
      >
        경기 인원
      </label>

      <TacticsMobileSelect
        label="경기 인원 선택"
        description="양 팀의 경기 인원을 선택하세요."
        value={String(value)}
        options={options.map((count) => ({
          value: String(count),
          label: `${count}대${count}`,
        }))}
        disabled={!canManage || isSaving}
        onChange={(nextValue) =>
          onChange(Number(nextValue) as MatchPlayersPerSide)
        }
      />

      <div className="relative hidden md:block">
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

        <ChevronDown
          aria-hidden="true"
          className={`pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
            canManage && !isSaving ? "text-stone-400" : "text-stone-300"
          }`}
        />
      </div>
    </div>
  );
}

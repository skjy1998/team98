import type { FormationName } from "@/types/tactics";
import { ChevronDown } from "lucide-react";

interface TacticsFormationSelectProps {
  formation: FormationName;
  options: FormationName[];
  onChange: (value: FormationName) => void;
  canManage: boolean;
}

export default function TacticsFormationSelect({
  formation,
  options,
  onChange,
  canManage,
}: Readonly<TacticsFormationSelectProps>) {
  return (
    <div className="min-w-[280px] flex-1">
      <label
        htmlFor="formation-select"
        className="mb-2 block text-sm font-medium text-stone-500"
      >
        포메이션
      </label>

      <div className="relative">
        <select
          id="formation-select"
          value={formation}
          onChange={(event) => onChange(event.target.value as FormationName)}
          disabled={!canManage}
          className={`h-14 w-full appearance-none rounded-xl border border-stone-200 px-5 pr-12 text-base font-semibold outline-none transition ${
            canManage
              ? "bg-stone-50 text-stone-800 focus:border-emerald-300 focus:bg-white"
              : "cursor-not-allowed bg-stone-100 text-stone-400"
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          className={`pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
            canManage ? "text-stone-400" : "text-stone-300"
          }`}
        />
      </div>
    </div>
  );
}

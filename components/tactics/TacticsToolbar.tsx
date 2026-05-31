import { formationTemplate } from "@/data/formationTemplates";
import { FormationName } from "@/types/tactics";
import { RotateCcw, Save } from "lucide-react";

interface TacticsToolbarProps {
  formation: FormationName;
  onChangeFormation: (value: FormationName) => void;
  onReset: () => void;
}

export default function TacticsToolbar({
  formation,
  onChangeFormation,
  onReset,
}: Readonly<TacticsToolbarProps>) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white px-4 py-4 md:px-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex-1 min-w-[280px]">
        <label
          htmlFor="formation-select"
          className="mb-2 block text-sm font-medium text-stone-500"
        >
          포메이션
        </label>

        <select
          id="formation-select"
          value={formation}
          onChange={(e) => onChangeFormation(e.target.value as FormationName)}
          className="h-14 w-full rounded-xl border border-stone-200 bg-stone-50 px-5 text-base font-semibold text-stone-800 outline-none transition focus:border-emerald-300 focus:bg-white"
        >
          {Object.keys(formationTemplate).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-14 items-center gap-2 rounded-xl border border-stone-200 px-5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>

        <div className="inline-flex h-14 items-center gap-2 rounded-xl bg-emerald-50 px-5 text-sm font-medium text-emerald-700">
          <Save className="h-4 w-4" />
          자동 저장됨
        </div>
      </div>
    </div>
  );
}

import { formationTemplate } from "@/data/formationTemplates";
import { FormationName } from "@/types/tactics";
import { RotateCcw, Save, Trash2 } from "lucide-react";

interface TacticsToolbarProps {
  formation: FormationName;
  onChangeFormation: (value: FormationName) => void;
  onReset: () => void;
  presetName?: string;
  onChangePresetName?: (value: string) => void;
  savedPresets?: { id: string; name: string }[];
  selectedPresetId?: string;
  onLoadPreset?: (presetId: string) => void;
  saveMode: "manual" | "auto";
  onSave?: () => void;
  onDelete?: () => void;
}

export default function TacticsToolbar({
  formation,
  onChangeFormation,
  onReset,
  presetName,
  onChangePresetName,
  savedPresets,
  selectedPresetId,
  onLoadPreset,
  saveMode,
  onSave,
  onDelete,
}: Readonly<TacticsToolbarProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-[280px] flex-1">
            <label
              htmlFor="formation-select"
              className="mb-2 block text-sm font-medium text-stone-500"
            >
              포메이션
            </label>

            <select
              id="formation-select"
              value={formation}
              onChange={(e) =>
                onChangeFormation(e.target.value as FormationName)
              }
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

            {saveMode === "auto" && (
              <div className="inline-flex h-14 items-center gap-2 rounded-xl bg-emerald-50 px-5 text-sm font-medium text-emerald-700">
                <Save className="h-4 w-4" />
                자동 저장됨
              </div>
            )}
          </div>
        </div>

        {saveMode === "manual" && (
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <input
              value={presetName}
              onChange={(e) => onChangePresetName?.(e.target.value)}
              placeholder="전술 이름 입력"
              className="h-14 flex-1 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-300"
            />

            <select
              value={selectedPresetId}
              onChange={(e) => onLoadPreset?.(e.target.value)}
              className="h-14 min-w-[220px] rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 outline-none transition focus:border-emerald-300"
            >
              <option value="">저장된 전술 불러오기</option>
              {savedPresets?.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSave}
                className="inline-flex h-14 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Save className="h-4 w-4" />
                저장하기
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="inline-flex h-14 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

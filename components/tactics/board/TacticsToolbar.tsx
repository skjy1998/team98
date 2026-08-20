import { formationTemplate } from "@/data/formationTemplates";
import { MatchPlayersPerSide } from "@/types/match";
import type { FormationName } from "@/types/tactics";
import { ChevronDown, RotateCcw, Save, Trash2 } from "lucide-react";

interface TacticsToolbarProps {
  formation: FormationName;
  formationOptions?: FormationName[];
  onChangeFormation: (value: FormationName) => void;
  onReset: () => void;
  canManage: boolean;
  playerCountOptions?: readonly MatchPlayersPerSide[];
  playersPerSide?: MatchPlayersPerSide;
  onChangePlayersPerSide?: (value: MatchPlayersPerSide) => void;
  isPlayerCountSaving?: boolean;
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
  formationOptions,
  onChangeFormation,
  onReset,
  canManage,
  playerCountOptions,
  playersPerSide,
  onChangePlayersPerSide,
  isPlayerCountSaving = false,
  presetName,
  onChangePresetName,
  savedPresets,
  selectedPresetId,
  onLoadPreset,
  saveMode,
  onSave,
  onDelete,
}: Readonly<TacticsToolbarProps>) {
  const availableFormationOptions =
    formationOptions ?? (Object.keys(formationTemplate) as FormationName[]);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          {saveMode === "auto" &&
            playerCountOptions &&
            playersPerSide !== undefined && (
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
                    value={playersPerSide}
                    onChange={(event) =>
                      onChangePlayersPerSide?.(
                        Number(event.target.value) as MatchPlayersPerSide,
                      )
                    }
                    disabled={!canManage || isPlayerCountSaving}
                    className={`h-14 w-full appearance-none rounded-xl border border-stone-200 px-5 pr-12 text-base font-semibold outline-none transition ${
                      canManage && !isPlayerCountSaving
                        ? "bg-stone-50 text-stone-800 focus:border-emerald-300 focus:bg-white"
                        : "cursor-not-allowed bg-stone-100 text-stone-400"
                    }`}
                  >
                    {playerCountOptions.map((count) => (
                      <option key={count} value={count}>
                        {count}대{count}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
            )}
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
                onChange={(event) =>
                  onChangeFormation(event.target.value as FormationName)
                }
                disabled={!canManage}
                className={`h-14 w-full appearance-none rounded-xl border border-stone-200 px-5 pr-12 text-base font-semibold outline-none transition ${
                  canManage
                    ? "bg-stone-50 text-stone-800 focus:border-emerald-300 focus:bg-white"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {availableFormationOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              disabled={!canManage}
              className={`inline-flex h-14 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition ${
                canManage
                  ? "border-stone-200 text-stone-600 hover:bg-stone-50"
                  : "border-stone-200 bg-stone-100 text-stone-400"
              }`}
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
              onChange={(event) => onChangePresetName?.(event.target.value)}
              placeholder="전술 이름 입력"
              disabled={!canManage}
              className={`h-14 flex-1 rounded-xl border px-4 text-sm outline-none transition placeholder:text-stone-400 ${
                canManage
                  ? "border-stone-200 bg-white text-stone-800 focus:border-emerald-300"
                  : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
              }`}
            />

            <select
              value={selectedPresetId}
              onChange={(event) => onLoadPreset?.(event.target.value)}
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
                disabled={!canManage}
                className={`inline-flex h-14 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition ${
                  canManage
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "cursor-not-allowed bg-stone-200 text-stone-400"
                }`}
              >
                <Save className="h-4 w-4" />
                저장하기
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={!canManage}
                className={`inline-flex h-14 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
                  canManage
                    ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                    : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                }`}
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

import { Save, Trash2 } from "lucide-react";
import TacticsMobileSelect from "./TacticsMobileSelect";

interface TacticsPresetControlsProps {
  presetName: string;
  onChangePresetName: (value: string) => void;
  savedPresets: { id: string; name: string }[];
  selectedPresetId: string;
  onLoadPreset: (presetId: string) => void;
  onSave: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  canManage: boolean;
  isSaving: boolean;
  isDeleting: boolean;
}

export default function TacticsPresetControls({
  presetName,
  onChangePresetName,
  savedPresets,
  selectedPresetId,
  onLoadPreset,
  onSave,
  onDelete,
  canManage,
  isSaving,
  isDeleting,
}: Readonly<TacticsPresetControlsProps>) {
  const isBusy = isSaving || isDeleting;
  const canEdit = canManage && !isBusy;
  const canSave = canEdit && presetName.trim().length > 0;
  const canDelete = canEdit && selectedPresetId.length > 0;

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center">
      <input
        value={presetName}
        onChange={(event) => onChangePresetName(event.target.value)}
        placeholder="전술 이름 입력"
        aria-label="전술 이름"
        disabled={!canEdit}
        className={`h-12 w-full rounded-xl border px-3.5 text-sm outline-none transition placeholder:text-stone-400 sm:h-14 sm:px-4 lg:flex-1 ${
          canEdit
            ? "border-stone-200 bg-white text-stone-800 focus:border-emerald-300"
            : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
        }`}
      />

      <TacticsMobileSelect
        label="저장된 전술"
        description="저장한 전술을 불러와 현재 보드에 적용하세요."
        value={selectedPresetId}
        options={[
          { value: "", label: "저장된 전술 불러오기" },
          ...savedPresets.map((preset) => ({
            value: preset.id,
            label: preset.name,
          })),
        ]}
        disabled={isBusy}
        onChange={onLoadPreset}
      />
      <div className="hidden md:block lg-w-[220px] lg:shrink-0">
        <select
          value={selectedPresetId}
          disabled={isBusy}
          onChange={(event) => onLoadPreset(event.target.value)}
          className={`h-14 w-full min-w-0 rounded-xl border border-stone-200 px-4 text-sm font-medium outline-none transition ${
            isBusy
              ? "cursor-not-allowed bg-stone-100 text-stone-400"
              : "bg-white text-stone-700 focus:border-emerald-300"
          }`}
          aria-label="저장된 전술 선택"
        >
          <option value="">저장된 전술 불러오기</option>
          {savedPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center ">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className={`inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition sm:h-14 sm:w-auto sm:gap-2 sm:px-5 sm:text-sm ${
            canSave
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-stone-200 text-stone-400"
          }`}
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          {isSaving ? "저장 중..." : "저장하기"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          className={`inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition sm:h-14 sm:w-auto sm:gap-2 sm:px-5 sm:text-sm ${
            canDelete
              ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
              : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          }`}
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          {isDeleting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </div>
  );
}

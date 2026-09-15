import { Save, Trash2 } from "lucide-react";

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
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <input
        value={presetName}
        onChange={(event) => onChangePresetName(event.target.value)}
        placeholder="전술 이름 입력"
        aria-label="전술 이름"
        disabled={!canEdit}
        className={`h-14 flex-1 rounded-xl border px-4 text-sm outline-none transition placeholder:text-stone-400 ${
          canEdit
            ? "border-stone-200 bg-white text-stone-800 focus:border-emerald-300"
            : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
        }`}
      />

      <select
        value={selectedPresetId}
        disabled={isBusy}
        onChange={(event) => onLoadPreset(event.target.value)}
        className={`h-14 min-w-[220px] rounded-xl border border-stone-200 px-4 text-sm font-medium outline-none transition ${
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

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className={`inline-flex h-14 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition ${
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
          className={`inline-flex h-14 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition ${
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

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
}: Readonly<TacticsPresetControlsProps>) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <input
        value={presetName}
        onChange={(event) => onChangePresetName(event.target.value)}
        placeholder="전술 이름 입력"
        aria-label="전술 이름"
        disabled={!canManage}
        className={`h-14 flex-1 rounded-xl border px-4 text-sm outline-none transition placeholder:text-stone-400 ${
          canManage
            ? "border-stone-200 bg-white text-stone-800 focus:border-emerald-300"
            : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
        }`}
      />

      <select
        value={selectedPresetId}
        onChange={(event) => onLoadPreset(event.target.value)}
        className="h-14 min-w-[220px] rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 outline-none transition focus:border-emerald-300"
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
  );
}

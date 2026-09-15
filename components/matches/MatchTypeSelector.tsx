import type { MatchType } from "@/types/match";

interface MatchTypeSelectorProps {
  value: MatchType;
  onChange: (value: MatchType) => void;
  disabled?: boolean;
}

export default function MatchTypeSelector({
  value,
  onChange,
  disabled,
}: Readonly<MatchTypeSelectorProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
      <p className="text-sm text-stone-400">경기 유형</p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onChange("정규")}
          disabled={disabled}
          className={`rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
            value === "정규"
              ? "bg-emerald-600 text-white"
              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          정규
        </button>

        <button
          type="button"
          onClick={() => onChange("자체전")}
          disabled={disabled}
          className={`rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
            value === "자체전"
              ? "bg-sky-600 text-white"
              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          자체전
        </button>
      </div>
    </div>
  );
}

import { MatchType } from "@/types/match";

interface MatchCreateTypeSectionProps {
  type: MatchType;
  onChangeType: (value: MatchType) => void;
}

export default function MatchCreateTypeSection({
  type,
  onChangeType,
}: Readonly<MatchCreateTypeSectionProps>) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold text-stone-900">경기 종류</p>
        <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
          필수
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={type === "정규"}
          onClick={() => onChangeType("정규")}
          className={`rounded-xl border px-3 py-3.5 text-center transition active:scale-[0.98] sm:px-6 sm:py-5 ${
            type === "정규"
              ? "border-emerald-300 bg-emerald-50 text-emerald-600"
              : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
          }`}
        >
          <p className="text-lg font-bold sm:text-2xl">정규</p>
          <p
            className={`mt-1 text-xs font-medium sm:mt-2 sm:text-sm ${
              type === "정규" ? "text-emerald-400" : "text-stone-400"
            }`}
          >
            상대팀과 경기
          </p>
        </button>
        <button
          type="button"
          aria-pressed={type === "자체전"}
          onClick={() => onChangeType("자체전")}
          className={`rounded-xl border px-3 py-3.5 text-center transition active:scale-[0.98] sm:px-6 sm:py-5 ${
            type === "자체전"
              ? "border-sky-300 bg-sky-50 text-sky-600"
              : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
          }`}
        >
          <p className="text-lg font-bold sm:text-2xl">자체전</p>
          <p
            className={`mt-1 text-xs font-medium sm:mt-2 sm:text-sm ${
              type === "자체전" ? "text-sky-400" : "text-stone-400"
            }`}
          >
            팀 내 자체 경기
          </p>
        </button>
      </div>
    </section>
  );
}

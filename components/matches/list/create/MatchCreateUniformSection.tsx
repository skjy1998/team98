import type { MatchUniform } from "@/types/match";

interface MatchCreateUniformSectionProps {
  uniform: MatchUniform;
  onChangeUniform: (value: MatchUniform) => void;
}

export default function MatchCreateUniformSection({
  uniform,
  onChangeUniform,
}: Readonly<MatchCreateUniformSectionProps>) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold text-stone-900">유니폼</p>
        <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
          선택
        </span>
      </div>

      <div className="grid grid-cols-2 rounded-2xl border border-stone-200 bg-white p-1">
        <button
          type="button"
          aria-pressed={uniform === "home"}
          onClick={() => onChangeUniform("home")}
          className={`rounded-[18px] px-5 py-4 text-lg font-semibold transition ${
            uniform === "home"
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-stone-500 hover:bg-stone-100"
          }`}
        >
          홈
        </button>

        <button
          type="button"
          aria-pressed={uniform === "away"}
          onClick={() => onChangeUniform("away")}
          className={`rounded-[18px] px-5 py-4 text-lg font-semibold transition ${
            uniform === "away"
              ? "bg-stone-900 text-white shadow-sm"
              : "text-stone-500 hover:bg-stone-100"
          }`}
        >
          어웨이
        </button>
      </div>
    </section>
  );
}

import type { MatchUniform } from "@/types/match";

interface MatchUniformSelectorProps {
  value: MatchUniform;
  onChange: (value: MatchUniform) => void;
  disabled?: boolean;
}

export default function MatchUniformSelector({
  value,
  onChange,
  disabled = false,
}: Readonly<MatchUniformSelectorProps>) {
  return (
    <div className="grid grid-cols-2 rounded-xl border border-stone-200 bg-white p-1">
      <button
        type="button"
        aria-pressed={value === "home"}
        disabled={disabled}
        onClick={() => onChange("home")}
        className={[
          "rounded-lg px-3 py-2.5 text-xs font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3 sm:text-sm",
          value === "home"
            ? "bg-emerald-500 text-white shadow-sm"
            : "text-stone-500 hover:bg-stone-100",
        ].join(" ")}
      >
        홈
      </button>

      <button
        type="button"
        aria-pressed={value === "away"}
        disabled={disabled}
        onClick={() => onChange("away")}
        className={[
          "rounded-lg px-3 py-2.5 text-xs font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3 sm:text-sm",
          value === "away"
            ? "bg-stone-900 text-white shadow-sm"
            : "text-stone-500 hover:bg-stone-100",
        ].join(" ")}
      >
        어웨이
      </button>
    </div>
  );
}

import type { TeamSport } from "@/types/team";

interface MatchSportSelectorProps {
  value: TeamSport;
  onChange: (sport: TeamSport) => void;
  disabled?: boolean;
}

export default function MatchSportSelector({
  value,
  onChange,
  disabled = false,
}: Readonly<MatchSportSelectorProps>) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        aria-pressed={value === "soccer"}
        disabled={disabled}
        onClick={() => onChange("soccer")}
        className={[
          "rounded-xl border px-3 py-3.5 text-center transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-5",
          value === "soccer"
            ? "border-emerald-300 bg-emerald-50 text-emerald-600"
            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
        ].join(" ")}
      >
        <p className="text-lg font-bold sm:text-2xl">축구</p>
        <p
          className={[
            "mt-1 text-xs font-medium sm:mt-2 sm:text-sm",
            value === "soccer" ? "text-emerald-400" : "text-stone-400",
          ].join(" ")}
        >
          축구 경기 방식
        </p>
      </button>
      <button
        type="button"
        aria-pressed={value === "futsal"}
        disabled={disabled}
        onClick={() => onChange("futsal")}
        className={[
          "rounded-xl border px-3 py-3.5 text-center transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-5",
          value === "futsal"
            ? "border-sky-300 bg-sky-50 text-sky-600"
            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
        ].join(" ")}
      >
        <p className="text-lg font-bold sm:text-2xl">풋살</p>
        <p
          className={[
            "mt-1 text-xs font-medium sm:mt-2 sm:text-sm",
            value === "futsal" ? "text-sky-400" : "text-stone-400",
          ].join(" ")}
        >
          풋살 경기 방식
        </p>
      </button>
    </div>
  );
}

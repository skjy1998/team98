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
          "rounded-xl border px-6 py-5 text-center transition disabled:cursor-not-allowed disabled:opacity-50",
          value === "soccer"
            ? "border-emerald-300 bg-emerald-50 text-emerald-600"
            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
        ].join(" ")}
      >
        <p className="text-2xl font-bold">축구</p>
        <p
          className={[
            "mt-2 text-sm font-medium",
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
          "rounded-xl border px-6 py-5 text-center transition disabled:cursor-not-allowed disabled:opacity-50",
          value === "futsal"
            ? "border-sky-300 bg-sky-50 text-sky-600"
            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
        ].join(" ")}
      >
        <p className="text-2xl font-bold">풋살</p>
        <p
          className={[
            "mt-2 text-sm font-medium",
            value === "futsal" ? "text-sky-400" : "text-stone-400",
          ].join(" ")}
        >
          풋살 경기 방식
        </p>
      </button>
    </div>
  );
}

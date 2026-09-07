import type { TeamSport } from "@/types/team";
import { LayoutGrid } from "lucide-react";
import { FaFutbol } from "react-icons/fa6";

interface TeamSportOptionProps {
  sport: TeamSport;
  selected: boolean;
  disabled: boolean;
  onSelect: (sport: TeamSport) => void;
}

const sportContent = {
  soccer: {
    label: "축구",
    description: "정규 축구 경기 기준으로 팀을 운영해요.",
    icon: FaFutbol,
  },
  futsal: {
    label: "풋살",
    description: "소규모 인원 중심으로 팀을 운영해요.",
    icon: LayoutGrid,
  },
} as const;

export default function TeamSportOption({
  sport,
  selected,
  disabled,
  onSelect,
}: Readonly<TeamSportOptionProps>) {
  const content = sportContent[sport];
  const Icon = content.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(sport)}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-emerald-300 bg-emerald-50"
          : "border-stone-200 bg-white hover:bg-stone-50",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            selected
              ? "bg-emerald-100 text-emerald-600"
              : "bg-stone-100 text-stone-400",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </span>

        <span className="min-w-0">
          <span
            className={[
              "block text-sm font-semibold",
              selected ? "text-emerald-700" : "text-stone-900",
            ].join(" ")}
          >
            {content.label}
          </span>
          <span className="mt-1 block text-xs leading-5 text-stone-500">
            {content.description}
          </span>
        </span>
      </div>
    </button>
  );
}

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
    description: "축구를 중심으로 활동하는 팀",
    icon: FaFutbol,
  },
  futsal: {
    label: "풋살",
    description: "풋살을 중심으로 활동하는 팀",
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
        "relative rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-white",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-10 w-10 items-center justify-center rounded-xl",
          selected ? "bg-emerald-600 text-white" : "bg-white text-stone-500",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>

      <span className="mt-4 block text-sm font-black text-stone-900">
        {content.label}
      </span>

      <span className="mt-1 block text-xs leading-5 text-stone-500">
        {content.description}
      </span>

      <span
        className={[
          "absolute right-4 top-4 h-2.5 w-2.5 rounded-full",
          selected ? "bg-emerald-500" : "bg-stone-200",
        ].join(" ")}
      />
    </button>
  );
}

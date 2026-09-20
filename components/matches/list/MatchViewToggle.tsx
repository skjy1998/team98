import type { MatchScheduleView } from "@/types/match";
import { CalendarDays, List } from "lucide-react";

interface MatchViewToggleProps {
  value: MatchScheduleView;
  onChange: (view: MatchScheduleView) => void;
}

const viewOptions = [
  {
    value: "list",
    label: "목록",
    icon: List,
  },
  {
    value: "calendar",
    label: "캘린더",
    icon: CalendarDays,
  },
] satisfies Array<{
  value: MatchScheduleView;
  label: string;
  icon: typeof List;
}>;

export default function MatchViewToggle({
  value,
  onChange,
}: Readonly<MatchViewToggleProps>) {
  return (
    <div
      className="inline-flex rounded-xl border border-stone-200 bg-stone-100 p-1"
      aria-label="경기 일정 보기 방식"
    >
      {viewOptions.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-label={`${option.label} 보기`}
            aria-pressed={isActive}
            className={[
              "inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition sm:h-9 sm:w-auto sm:gap-2 sm:px-3 sm:text-sm",
              isActive
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800",
            ].join(" ")}
          >
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

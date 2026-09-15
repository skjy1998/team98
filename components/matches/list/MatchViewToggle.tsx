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
            aria-pressed={isActive}
            className={[
              "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
              isActive
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

import { getCalendarDayResult } from "@/lib/matches/match-calendar";
import type { MatchCalendarDay } from "@/types/match";

interface MatchMobileCalendarDayCellProps {
  calendarDay: MatchCalendarDay;
  index: number;
  isSelected: boolean;
  onSelect: (date: string) => void;
}

const markerStyles = {
  scheduled: {
    label: "일정",
    className: "bg-emerald-50 text-emerald-700",
  },
  win: {
    label: "승",
    className: "bg-emerald-100 text-emerald-700",
  },
  draw: {
    label: "무",
    className: "bg-stone-100 text-stone-600",
  },
  lose: {
    label: "패",
    className: "bg-rose-100 text-rose-600",
  },
  canceled: {
    label: "취",
    className: "bg-stone-100 text-stone-400",
  },
  mixed: {
    label: "+",
    className: "bg-sky-100 text-sky-700",
  },
} as const;

export default function MatchMobileCalendarDayCell({
  calendarDay,
  index,
  isSelected,
  onSelect,
}: Readonly<MatchMobileCalendarDayCellProps>) {
  const isSunday = index % 7 === 0;
  const hasMatches = calendarDay.matches.length > 0;
  const result = getCalendarDayResult(calendarDay.matches);
  const marker = markerStyles[result];

  return (
    <button
      type="button"
      disabled={!calendarDay.isCurrentMonth || !hasMatches}
      onClick={() => onSelect(calendarDay.date)}
      aria-pressed={isSelected}
      className={[
        "relative flex aspect-square w-full flex-col items-center justify-start rounded-xl px-1 pt-1.5 transition",
        calendarDay.isCurrentMonth
          ? "text-stone-900"
          : "cursor-default text-stone-300",
        hasMatches && calendarDay.isCurrentMonth
          ? "hover:bg-stone-50 active:scale-[0.98]"
          : "",
        isSelected ? "bg-emerald-50 ring-1 ring-inset ring-emerald-300" : "",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-5 min-w-5 items-center justify-center text-xs font-semibold",
          calendarDay.isToday
            ? "rounded-full bg-emerald-600 px-1 text-white"
            : "",
          !calendarDay.isToday && isSunday ? "text-rose-500" : "",
        ].join(" ")}
      >
        {calendarDay.day}
      </span>

      {hasMatches && calendarDay.isCurrentMonth && (
        <span
          className={`mt-1 inline-flex min-w-5 items-center justify-center rounded-md px-1 py-0.5 text-[9px] font-bold ${marker.className}`}
        >
          {marker.label}
        </span>
      )}

      {calendarDay.matches.length > 1 && calendarDay.isCurrentMonth && (
        <span className="absolute right-1 top-1 text-[9px] font-bold text-stone-400">
          +{calendarDay.matches.length - 1}
        </span>
      )}
    </button>
  );
}

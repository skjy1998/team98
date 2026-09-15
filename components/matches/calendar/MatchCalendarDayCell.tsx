import { getCalendarDayResult } from "@/lib/matches/match-calendar";
import type { MatchCalendarDay } from "@/types/match";
import MatchCalendarItem from "./MatchCalendarItem";

interface MatchCalendarDayCellProps {
  calendarDay: MatchCalendarDay;
  index: number;
  isExpanded: boolean;
  onMoveOutsideMonth: (date: string) => void;
  onToggleExpanded: (date: string) => void;
}

const calendarResultClassNames = {
  scheduled: "bg-white",
  win: "bg-emerald-50/80",
  draw: "bg-amber-50/80",
  lose: "bg-rose-50/80",
  canceled: "bg-stone-100/80",
  mixed: "bg-sky-50/80",
} as const;

export default function MatchCalendarDayCell({
  calendarDay,
  index,
  isExpanded,
  onMoveOutsideMonth,
  onToggleExpanded,
}: Readonly<MatchCalendarDayCellProps>) {
  const isSunday = index % 7 === 0;
  const dayResult = getCalendarDayResult(calendarDay.matches);

  const visibleMatches = isExpanded
    ? calendarDay.matches
    : calendarDay.matches.slice(0, 2);

  const hiddenMatchCount = Math.max(calendarDay.matches.length - 2, 0);

  return (
    <div
      className={[
        "min-h-40 p-2.5 transition-colors",
        index % 7 !== 6 ? "border-r border-stone-200" : "",
        index < 35 ? "border-b border-stone-200" : "",
        !calendarDay.isCurrentMonth
          ? "bg-stone-50/60"
          : calendarResultClassNames[dayResult],
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        {calendarDay.isCurrentMonth ? (
          <span
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
              calendarDay.isToday ? "bg-emerald-600 text-white" : "",
              !calendarDay.isToday && isSunday ? "text-rose-500" : "",
              !calendarDay.isToday && !isSunday ? "text-stone-600" : "",
            ].join(" ")}
          >
            {calendarDay.day}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onMoveOutsideMonth(calendarDay.date)}
            aria-label={`${calendarDay.date}이 포함된 달로 이동`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-stone-300 transition hover:bg-stone-200 hover:text-stone-600"
          >
            {calendarDay.day}
          </button>
        )}
      </div>

      <div className="mt-2 space-y-1.5">
        {visibleMatches.map((match) => (
          <MatchCalendarItem key={match.id} match={match} />
        ))}

        {calendarDay.matches.length > 2 && (
          <button
            type="button"
            onClick={() => onToggleExpanded(calendarDay.date)}
            aria-expanded={isExpanded}
            className="px-1 text-[11px] font-semibold text-stone-500 transition hover:text-stone-900"
          >
            {isExpanded ? "접기" : `+${hiddenMatchCount}개 일정`}
          </button>
        )}
      </div>
    </div>
  );
}

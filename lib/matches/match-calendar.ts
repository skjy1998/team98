import type { MatchCalendarDay, MatchItem } from "@/types/match";
import { getMatchResult } from "./match-display";

export type MatchCalendarResult =
  | "scheduled"
  | "win"
  | "draw"
  | "lose"
  | "canceled"
  | "mixed";

const CALENDAR_CELL_COUNT = 42;

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createCalendarDays(
  currentMonth: Date,
  matches: MatchItem[],
  today = new Date(),
): MatchCalendarDay[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);

  // 일요일부터 시작하는 달력에 맞춘 이전 달 날짜 개수입니다.
  const previousMonthDayCount = firstDay.getDay();
  const calendarStartDate = new Date(year, month, 1 - previousMonthDayCount);
  const todayKey = formatDateKey(today);

  const matchesByDate = Map.groupBy(matches, (match) => match.date);

  return Array.from({ length: CALENDAR_CELL_COUNT }, (_, index) => {
    const date = new Date(
      calendarStartDate.getFullYear(),
      calendarStartDate.getMonth(),
      calendarStartDate.getDate() + index,
    );

    const dateKey = formatDateKey(date);
    const dayMatches = matchesByDate.get(dateKey) ?? [];

    return {
      date: dateKey,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: dateKey === todayKey,
      matches: dayMatches.toSorted((a, b) =>
        a.startTime.localeCompare(b.startTime),
      ),
    };
  });
}

export function moveCalendarMonth(currentMonth: Date, offset: number) {
  return new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + offset,
    1,
  );
}

export function formatCalendarMonth(currentMonth: Date) {
  return `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;
}

export function getCalendarMonthFromDate(date: string) {
  const [year, month] = date.split("-").map(Number);

  return new Date(year, month - 1, 1);
}

export function getCalendarDayResult(
  matches: MatchItem[],
): MatchCalendarResult {
  if (matches.length === 0) {
    return "scheduled";
  }

  const regularMatchResults = matches
    .filter((match) => match.type !== "자체전")
    .map(getMatchResult)
    .filter(
      (result): result is "win" | "draw" | "lose" =>
        result === "win" || result === "draw" || result === "lose",
    );

  const uniqueResults = new Set(regularMatchResults);

  if (uniqueResults.size > 1) {
    return "mixed";
  }

  const [result] = uniqueResults;

  if (result) {
    return result;
  }

  const hasCanceledMatch = matches.some((match) => match.status === "canceled");

  return hasCanceledMatch ? "canceled" : "scheduled";
}

export function getInitialCalendarMonth(
  matches: MatchItem[],
  today = new Date(),
) {
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  if (matches.length === 0) {
    return currentMonth;
  }

  const currentMonthKey = formatDateKey(currentMonth).slice(0, 7);
  const hasCurrentMonthMatch = matches.some((match) =>
    match.date.startsWith(currentMonthKey),
  );

  if (hasCurrentMonthMatch) {
    return currentMonth;
  }

  const todayTime = today.getTime();

  const nearestMatch = matches.toSorted((a, b) => {
    const aTime = new Date(`${a.date}T${a.startTime}`).getTime();
    const bTime = new Date(`${b.date}T${b.startTime}`).getTime();

    return Math.abs(aTime - todayTime) - Math.abs(bTime - todayTime);
  })[0];

  return getCalendarMonthFromDate(nearestMatch.date);
}

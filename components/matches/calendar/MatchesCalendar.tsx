"use client";

import {
  createCalendarDays,
  formatCalendarMonth,
  getCalendarMonthFromDate,
  getInitialCalendarMonth,
  moveCalendarMonth,
} from "@/lib/matches/match-calendar";
import type { MatchItem } from "@/types/match";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import MatchCalendarLegend from "./MatchCalendarLegend";
import MatchCalendarDayCell from "./MatchCalendarDayCell";
import MatchMobileCalendarDayCell from "./MatchMobileCalendarDayCell";
import MatchMobileCalendarDetail from "./MatchMobileCalendarDetail";

interface MatchesCalendarProps {
  matches: MatchItem[];
}

const weekDays = ["일", "월", "화", "수", "목", "금", "토"] as const;

function createCurrentMonth() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), 1);
}

export default function MatchesCalendar({
  matches,
}: Readonly<MatchesCalendarProps>) {
  const [today] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() =>
    getInitialCalendarMonth(matches, today),
  );
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const calendarDays = createCalendarDays(currentMonth, matches, today);
  const selectedCalendarDay = calendarDays.find(
    (calendarDay) => calendarDay.date === selectedDate,
  );

  const handleMoveMonth = (offset: number) => {
    setCurrentMonth((month) => moveCalendarMonth(month, offset));
    setExpandedDate(null);
    setSelectedDate(null);
  };

  const handleMoveToday = () => {
    setCurrentMonth(createCurrentMonth());
    setExpandedDate(null);
    setSelectedDate(null);
  };

  const handleMoveOutsideMonth = (date: string) => {
    setCurrentMonth(getCalendarMonthFromDate(date));
    setExpandedDate(null);
    setSelectedDate(null);
  };

  const handleToggleExpanded = (date: string) => {
    setExpandedDate((currentDate) => (currentDate === date ? null : date));
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate((currentDate) => (currentDate === date ? null : date));
  };

  return (
    <section
      className="overflow-hidden rounded-[24px] border border-stone-200 bg-white"
      aria-label="경기 일정 캘린더"
    >
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMoveMonth(-1)}
            aria-label="이전 달"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleMoveMonth(1)}
            aria-label="다음 달"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <h2 className="text-lg font-bold tracking-tight text-stone-900">
          {formatCalendarMonth(currentMonth)}
        </h2>

        <button
          type="button"
          onClick={handleMoveToday}
          className="h-9 rounded-xl border border-stone-200 px-3 text-sm font-semibold text-stone-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          오늘
        </button>
      </div>
      <div className="hidden items-center justify-end border-b border-stone-200 px-5 py-2.5 md:flex">
        <MatchCalendarLegend />
      </div>
      <div className="md:hidden">
        <div className="grid grid-cols-7 px-2 pt-2">
          {weekDays.map((weekDay, index) => (
            <div
              key={weekDay}
              className={[
                "py-2 text-center text-xs font-semibold",
                index === 0 ? "text-rose-500" : "text-stone-500",
              ].join(" ")}
            >
              {weekDay}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 px-2 pb-2">
          {calendarDays.map((calendarDay, index) => (
            <MatchMobileCalendarDayCell
              key={calendarDay.date}
              calendarDay={calendarDay}
              index={index}
              isSelected={selectedDate === calendarDay.date}
              onSelect={handleSelectDate}
            />
          ))}
        </div>

        {selectedCalendarDay && (
          <div className="border-t border-stone-100 p-3">
            <MatchMobileCalendarDetail calendarDay={selectedCalendarDay} />
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/80">
          {weekDays.map((weekDay, index) => (
            <div
              key={weekDay}
              className={[
                "py-3 text-center text-xs font-semibold",
                index === 0 ? "text-rose-500" : "text-stone-500",
              ].join(" ")}
            >
              {weekDay}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((calendarDay, index) => (
            <MatchCalendarDayCell
              key={calendarDay.date}
              calendarDay={calendarDay}
              index={index}
              isExpanded={expandedDate === calendarDay.date}
              onMoveOutsideMonth={handleMoveOutsideMonth}
              onToggleExpanded={handleToggleExpanded}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

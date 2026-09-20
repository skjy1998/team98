import { formatMatchMonthDay, formatMatchTime } from "@/lib/matches/match-time";
import type { MatchCalendarDay, MatchItem } from "@/types/match";
import Link from "next/link";

interface MatchMobileCalendarDetailProps {
  calendarDay?: MatchCalendarDay;
}

function getScoreText(match: MatchItem) {
  if (match.status === "canceled") return "경기 취소";

  if (match.ourScore === undefined || match.opponentScore === undefined) {
    return "경기 전";
  }

  return `${match.ourScore} : ${match.opponentScore}`;
}

export default function MatchMobileCalendarDetail({
  calendarDay,
}: Readonly<MatchMobileCalendarDetailProps>) {
  if (!calendarDay || calendarDay.matches.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
      aria-label={`${formatMatchMonthDay(calendarDay.date)} 경기 일정`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-900">
            {formatMatchMonthDay(calendarDay.date)} 경기
          </p>
          <p className="mt-1 text-xs text-stone-400">
            선택한 날짜의 경기 일정이에요.
          </p>
        </div>

        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
          {calendarDay.matches.length}경기
        </span>
      </div>

      <div className="mt-4 divide-y divide-stone-100">
        {calendarDay.matches.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-800">
                {match.title}
              </p>
              <p className="mt-1 truncate text-xs text-stone-400">
                {formatMatchTime(match)} · {match.location || "장소 미정"}
              </p>
            </div>

            <span className="shrink-0 text-sm font-bold text-stone-900">
              {getScoreText(match)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

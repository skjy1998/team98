import { formatMatchMonthDay, formatMatchTime } from "@/lib/matches/match-time";
import {
  getMatchResult,
  matchSportMap,
  statusMap,
  typeMap,
} from "@/lib/matches/match-display";
import type { MatchItem } from "@/types/match";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  getMatchValueText,
  shouldShowMatchStatusBadge,
} from "@/lib/matches/match-list-ui";

interface MatchListCardProps {
  match: MatchItem;
}

export default function MatchListCard({ match }: Readonly<MatchListCardProps>) {
  const result = getMatchResult(match);
  const status = statusMap[result];

  const valueText = getMatchValueText(match);
  const sport = matchSportMap[match.sport];

  const hasRecordedResult =
    result === "win" || result === "lose" || result === "draw";

  const isSelfMatchResult = match.type === "자체전" && hasRecordedResult;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="group block rounded-[22px] border border-stone-200 bg-white p-3.5 transition-colors hover:border-stone-300 hover:bg-stone-50/50 sm:p-4"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="min-w-0 truncate text-sm font-semibold text-stone-900 sm:text-base">
              {match.title}
            </h3>
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold sm:px-2.5 sm:py-1 ${sport.className}`}
            >
              {sport.label}
            </span>
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold sm:px-2.5 sm:py-1 ${typeMap[match.type]}`}
            >
              {match.type}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-xs sm:text-sm">
            <p className="text-stone-500">{formatMatchTime(match)}</p>
            <p className="truncate text-stone-400">
              {match.location || "장소 미정"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0 text-right">
          <p className="text-xs font-medium text-stone-400">
            {formatMatchMonthDay(match.date)}
          </p>
          <div className="mt-3 flex shrink-0 items-center gap-2 text-right sm:mt-4 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {isSelfMatchResult ? (
                <div
                  className="flex items-baseline gap-2"
                  aria-label={`A팀 ${match.ourScore ?? 0}점, B팀 ${
                    match.opponentScore ?? 0
                  }점`}
                >
                  <span className="text-xs font-bold text-emerald-700 sm:text-sm">
                    A
                  </span>
                  <span className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                    {match.ourScore ?? 0}
                  </span>

                  <span className="text-xs font-bold text-sky-700 sm:text-sm">
                    B
                  </span>
                  <span className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                    {match.opponentScore ?? 0}
                  </span>
                </div>
              ) : (
                <p
                  className={[
                    "font-semibold",
                    hasRecordedResult
                      ? "text-xl tracking-tight sm:text-2xl"
                      : "text-xs sm:text-base",
                    status.scoreClassName,
                  ].join(" ")}
                >
                  {valueText}
                </p>
              )}

              {!isSelfMatchResult && shouldShowMatchStatusBadge(match) && (
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium sm:px-2.5 sm:py-1 sm:text-xs ${status.badgeClassName}`}
                >
                  {status.label}
                </span>
              )}
            </div>

            <ChevronRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

import {
  formatMatchDate,
  formatMatchTime,
  getMatchResult,
  getMatchValueText,
  matchSportMap,
  shouldShowMatchStatusBadge,
  statusMap,
  typeMap,
} from "@/lib/matches/match-ui";
import type { MatchItem } from "@/types/match";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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
      className="group block rounded-[22px] border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300 hover:bg-stone-50/50"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="min-w-0 truncate text-sm font-semibold text-stone-900 md:text-base">
              {match.title}
            </h3>
            <span
              className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${sport.className}`}
            >
              {sport.label}
            </span>
            <span
              className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${typeMap[match.type]}`}
            >
              {match.type}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-stone-500">
              {formatMatchDate(match.date)} · {formatMatchTime(match)}
            </p>
            <p className="truncate text-stone-400">
              {match.location || "장소 미정"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <div className="flex shrink-0 items-center gap-3 text-right">
            <div className="flex items-center gap-3">
              {isSelfMatchResult ? (
                <div
                  className="flex items-baseline gap-2"
                  aria-label={`A팀 ${match.ourScore ?? 0}점, B팀 ${
                    match.opponentScore ?? 0
                  }점`}
                >
                  <span className="text-sm font-bold text-emerald-700">A</span>
                  <span className="text-2xl font-bold tracking-tight text-stone-900">
                    {match.ourScore ?? 0}
                  </span>

                  <span className="ml-1 text-sm font-bold text-sky-700">B</span>
                  <span className="text-2xl font-bold tracking-tight text-stone-900">
                    {match.opponentScore ?? 0}
                  </span>
                </div>
              ) : (
                <p
                  className={[
                    "font-semibold",
                    hasRecordedResult
                      ? "text-2xl tracking-tight"
                      : "text-sm md:text-base",
                    status.scoreClassName,
                  ].join(" ")}
                >
                  {valueText}
                </p>
              )}

              {!isSelfMatchResult && shouldShowMatchStatusBadge(match) && (
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.badgeClassName}`}
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

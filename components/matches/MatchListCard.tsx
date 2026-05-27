import {
  formatMatchDate,
  formatMatchTime,
  getMatchResult,
  getMatchValueText,
  shouldShowMatchStatusBadge,
  statusMap,
  typeMap,
} from "@/lib/match-ui";
import { MatchItem } from "@/types/match";
import Link from "next/link";

interface MatchListCardProps {
  match: MatchItem;
}

export default function MatchListCard({ match }: Readonly<MatchListCardProps>) {
  const result = getMatchResult(match);
  const status = statusMap[result];
  const scoreText = getMatchValueText(match);
  return (
    <Link
      href={`/matches/${match.id}`}
      className="group block rounded-[22px] border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300 hover:bg-stone-50/50"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${typeMap[match.type]}`}
            >
              {match.type}
            </span>
          </div>
          <h3 className="truncate text-sm font-semibold text-stone-900 md:text-base">
            {match.title}
          </h3>
          <div className="mt-2 space-y-1 text-sm text-stone-400">
            <p>
              {formatMatchDate(match.date)} · {formatMatchTime(match)}
            </p>
            <p className="truncate">{match.location}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          {shouldShowMatchStatusBadge(match) && (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.badgeClassName}`}
            >
              {status.label}
            </span>
          )}
          <p
            className={`text-sm font-semibold md:text-base ${status.scoreClassName}`}
          >
            {scoreText}
          </p>
          <span className="text-sm text-stone-300 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

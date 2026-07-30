import {
  formatMatchDate,
  formatMatchTime,
  getMatchResult,
  getMatchValueText,
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

  return (
    <Link
      href={`/matches/${match.id}`}
      className="group block rounded-[22px] border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300 hover:bg-stone-50/50"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-stone-900 md:text-base">
              {match.title}
            </h3>
            <span
              className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${typeMap[match.type]}`}
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
            {valueText}
          </p>
          <ChevronRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

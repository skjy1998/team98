import { getMatchDetailDisplay } from "@/lib/matches/match-detail-ui";
import { matchSportMap, typeMap } from "@/lib/matches/match-display";
import { formatMatchDate } from "@/lib/matches/match-time";
import type { MatchItem } from "@/types/match";

interface MatchDetailHeaderProps {
  match: MatchItem;
  teamName: string;
}

export default function MatchDetailHeader({
  match,
  teamName,
}: Readonly<MatchDetailHeaderProps>) {
  const {
    displayScore,
    matchStatusLabel,
    matchSubText,
    opponentName,
    statusBadgeClassName,
  } = getMatchDetailDisplay(match);
  const sport = matchSportMap[match.sport];

  const isSelfMatch = match.type === "자체전";

  const safeTeamName = isSelfMatch ? "A팀" : teamName || "우리팀";
  const safeOpponentName = isSelfMatch ? "B팀" : opponentName || "상대 팀";

  const teamInitial = isSelfMatch ? "A" : safeTeamName.slice(0, 1);
  const opponentInitial = isSelfMatch ? "B" : safeOpponentName.slice(0, 1);

  return (
    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 md:px-8 md:py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${sport.className}`}
            >
              {sport.label}
            </span>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${typeMap[match.type]}`}
            >
              {match.type}
            </span>
          </div>

          <h1 className="mt-2 truncate text-base font-bold text-stone-900 sm:text-lg">
            {match.title}
          </h1>
        </div>

        <span className="text-xs font-medium text-stone-400">
          {match.playersPerSide} vs {match.playersPerSide}
        </span>
      </div>

      <div className="bg-stone-50/70 px-4 py-5 md:px-8 md:py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-6">
          <div className="flex min-w-0 flex-col items-center justify-center text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700 sm:h-20 sm:w-20 sm:rounded-3xl  sm:text-3xl">
              {teamInitial}
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-stone-900 sm:mt-3 sm:text-xl">
              {safeTeamName}
            </p>
          </div>

          <div className="min-w-0 text-center">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold sm:text-sm ${statusBadgeClassName}`}
            >
              {matchStatusLabel}
            </span>
            <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:mt-4 sm:text-5xl">
              {displayScore}
            </p>
            <p className="mt-1 text-xs text-stone-400 sm:mt-2 sm:text-sm">
              {matchSubText}
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-center justify-center text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-xl font-bold text-stone-700 sm:h-20 sm:w-20 sm:rounded-3xl sm:text-3xl">
              {opponentInitial}
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-stone-900 sm:mt-3 sm:text-xl">
              {safeOpponentName}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 px-4 py-3 md:px-8 md:py-4">
        <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 text-xs text-stone-500 sm:justify-center sm:text-sm">
          <span>{formatMatchDate(match.date)}</span>
          <span className="hidden text-stone-300 sm:inline">|</span>
          <span>
            {match.startTime} - {match.endTime}
          </span>
          <span className="hidden text-stone-300 sm:inline">|</span>
          <span className="basis-full sm:basis-auto">
            {match.location || "장소 미정"}
          </span>
        </div>
      </div>
    </section>
  );
}

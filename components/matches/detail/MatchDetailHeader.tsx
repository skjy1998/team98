import type { MatchItem } from "@/types/match";

interface MatchDetailHeaderProps {
  match: MatchItem;
  displayScore: string;
  matchStatusLabel: string;
  matchSubText: string;
  opponentName: string;
  statusBadgeClassName: string;
}

export default function MatchDetailHeader({
  match,
  displayScore,
  matchStatusLabel,
  matchSubText,
  opponentName,
  statusBadgeClassName,
}: Readonly<MatchDetailHeaderProps>) {
  const opponentInitial = opponentName.slice(0, 1);
  return (
    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="bg-stone-50/70 px-6 py-8 md:px-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-3xl font-bold text-emerald-700">
              F
            </div>
            <p className="mt-3 text-xl font-semibold text-stone-900">FC 98</p>
          </div>

          <div className="text-center">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeClassName}`}
            >
              {matchStatusLabel}
            </span>
            <p className="mt-4 text-5xl font-bold tracking-tight text-stone-900">
              {displayScore}
            </p>
            <p className="mt-2 text-sm text-stone-400">{matchSubText}</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-100 text-3xl font-bold text-stone-700">
              {opponentInitial}
            </div>
            <p className="mt-3 text-xl font-semibold text-stone-900">
              {opponentName}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 px-6 py-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-stone-500">
          <span>{match.date}</span>
          <span className="text-stone-300">|</span>
          <span>
            {match.startTime} - {match.endTime}
          </span>
          <span className="text-stone-300">|</span>
          <span>{match.location}</span>
        </div>
      </div>
    </section>
  );
}

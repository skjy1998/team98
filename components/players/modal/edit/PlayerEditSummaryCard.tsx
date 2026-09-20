import type { PlayerDetailPosition } from "@/types/player";

interface PlayerEditSummaryCardProps {
  playerName: string;
  number: string;
  detailPositions: PlayerDetailPosition[];
  birth: string;
  appearance: string;
  goal: string;
  assist: string;
}

export default function PlayerEditSummaryCard({
  playerName,
  number,
  detailPositions,
  birth,
  appearance,
  goal,
  assist,
}: Readonly<PlayerEditSummaryCardProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white p-3.5 sm:p-5">
      <div className="flex items-start gap-3 pr-8 sm:gap-4 sm:pr-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-2xl font-bold text-stone-700 shadow-sm sm:h-20 sm:w-20 sm:rounded-2xl sm:text-3xl">
          {playerName.slice(0, 1)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <p className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              {playerName}
            </p>

            {number && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 sm:px-3 sm:py-1 sm:text-xs">
                #{number}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-stone-500 sm:mt-2 sm:text-sm">
            {detailPositions.length > 0
              ? detailPositions.join(", ")
              : "포지션 미지정"}
          </p>

          {birth && (
            <p className="mt-1 text-xs text-stone-400 sm:text-sm">
              생년월일 {birth}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">
        <div className="rounded-lg border border-stone-200 bg-white px-2 py-2 text-center sm:rounded-xl sm:px-3 sm:py-2.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400">
            출전
          </p>
          <p className="mt-1 text-sm font-bold text-stone-900 sm:text-base">
            {appearance}
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white px-2 py-2 text-center sm:rounded-xl sm:px-3 sm:py-2.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400">
            득점
          </p>
          <p className="mt-1 text-sm font-bold text-stone-900 sm:text-base">
            {goal}
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white px-2 py-2 text-center sm:rounded-xl sm:px-3 sm:py-2.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400">
            어시
          </p>
          <p className="mt-1 text-sm font-bold text-stone-900 sm:text-base">
            {assist}
          </p>
        </div>
      </div>
    </section>
  );
}

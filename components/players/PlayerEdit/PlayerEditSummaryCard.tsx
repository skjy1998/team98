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
    <section className="rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white p-5 pr-14">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-white text-3xl font-bold text-stone-700 shadow-sm">
          {playerName.slice(0, 1)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-2xl font-bold tracking-tight text-stone-900">
              {playerName}
            </p>

            {number && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                #{number}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-stone-500">
            {detailPositions.length > 0
              ? detailPositions.join(", ")
              : "포지션 미지정"}
          </p>

          {birth && (
            <p className="mt-1 text-sm text-stone-400">생년월일 {birth}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-center">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400">
            출전
          </p>
          <p className="mt-1 text-base font-bold text-stone-900">
            {appearance}
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-center">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400">
            득점
          </p>
          <p className="mt-1 text-base font-bold text-stone-900">{goal}</p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-center">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-stone-400">
            어시
          </p>
          <p className="mt-1 text-base font-bold text-stone-900">{assist}</p>
        </div>
      </div>
    </section>
  );
}

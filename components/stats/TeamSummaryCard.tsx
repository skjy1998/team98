import type { RecentResult, TeamSummary } from "@/types/stats";

interface TeamSummaryCardProps {
  summary: TeamSummary;
  recentResults: RecentResult[];
}

const recentResultStyle = {
  win: { label: "승", className: "bg-emerald-100 text-emerald-700" },
  draw: { label: "무", className: "bg-stone-200 text-stone-600" },
  lose: { label: "패", className: "bg-rose-100 text-rose-600" },
} as const;

export default function TeamSummaryCard({
  summary,
  recentResults,
}: Readonly<TeamSummaryCardProps>) {
  const { win, draw, lose, winRate, goals, conceded, goalDiff } = summary;
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
            팀 전적
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
            <span className="text-2xl font-normal text-emerald-600 sm:text-4xl">
              {win}승
            </span>
            <span className="text-2xl font-normal text-stone-500 sm:text-4xl">
              {draw}무
            </span>
            <span className="text-2xl font-normal text-rose-500 sm:text-4xl">
              {lose}패
            </span>
            <span className="rounded-md border border-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-600 sm:px-2.5 sm:text-xs">
              승률 {winRate}%
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 sm:mt-5 sm:gap-3">
            <p className="text-xs text-stone-500 sm:text-sm">최근 5경기</p>

            <div className="flex items-center gap-2">
              {recentResults.length === 0 ? (
                <span className="text-sm text-stone-400">기록 없음</span>
              ) : (
                recentResults.map((result, index) => {
                  const style = recentResultStyle[result];

                  return (
                    <span
                      key={`${result}-${index}`}
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold sm:h-6 sm:w-6 sm:text-sm ${style.className}`}
                    >
                      {style.label}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-stone-100 pt-3 text-xs sm:gap-6 sm:border-t-0 sm:pt-0 sm:text-sm xl:text-left">
          <div className="rounded-lg bg-stone-50 px-2 py-2 text-center sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-left">
            <p className="text-stone-400">득점</p>
            <p className="mt-1 text-lg font-semibold text-stone-900 sm:mt-2 sm:text-2xl">
              {goals}
            </p>
          </div>
          <div className="rounded-lg bg-stone-50 px-2 py-2 text-center sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-left">
            <p className="text-stone-400">실점</p>
            <p className="mt-1 text-lg font-semibold text-stone-900 sm:mt-2 sm:text-2xl">
              {conceded}
            </p>
          </div>
          <div className="rounded-lg bg-stone-50 px-2 py-2 text-center sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-left">
            <p className="text-stone-400">득실차</p>
            <p
              className={`mt-1 text-lg font-semibold sm:mt-2 sm:text-2xl ${
                goalDiff > 0
                  ? "text-emerald-600"
                  : goalDiff < 0
                    ? "text-rose-500"
                    : "text-stone-900"
              }`}
            >
              {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

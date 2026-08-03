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
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">팀 전적</h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-normal text-emerald-600">
              {win}승
            </span>
            <span className="text-4xl font-normal text-stone-500">
              {draw}무
            </span>
            <span className="text-4xl font-normal text-rose-500">{lose}패</span>
            <span className="rounded-md border border-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
              승률 {winRate}%
            </span>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <p className="text-sm text-stone-500">최근 5경기</p>

            <div className="flex items-center gap-2">
              {recentResults.length === 0 ? (
                <span className="text-sm text-stone-400">기록 없음</span>
              ) : (
                recentResults.map((result, index) => {
                  const style = recentResultStyle[result];

                  return (
                    <span
                      key={`${result}-${index}`}
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${style.className}`}
                    >
                      {style.label}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-stone-400">득점</p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {goals}
            </p>
          </div>
          <div>
            <p className="text-stone-400">실점</p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              {conceded}
            </p>
          </div>
          <div>
            <div className="text-stone-400">득실차</div>
            <p
              className={`mt-2 text-2xl font-semibold ${
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

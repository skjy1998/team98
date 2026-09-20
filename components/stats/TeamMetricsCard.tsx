import type { TeamSummary } from "@/types/stats";

interface TeamMetricsCardProps {
  summary: TeamSummary;
}

export default function TeamMetricsCard({
  summary,
}: Readonly<TeamMetricsCardProps>) {
  const averageGoals =
    summary.total > 0 ? (summary.goals / summary.total).toFixed(1) : "0.0";

  const averageConceded =
    summary.total > 0 ? (summary.conceded / summary.total).toFixed(1) : "0.0";

  const averageGoalDifference =
    summary.total > 0
      ? ((summary.goals - summary.conceded) / summary.total).toFixed(1)
      : "0.0";

  const formattedAverageGoalDifference =
    Number(averageGoalDifference) > 0
      ? `+${averageGoalDifference}`
      : averageGoalDifference;

  const summaryItems = [
    {
      label: "경기당 평균 득점",
      value: averageGoals,
      valueClassName: "text-emerald-600",
    },
    {
      label: "경기당 평균 실점",
      value: averageConceded,
      valueClassName: "text-rose-600",
    },
    {
      label: "경기당 평균 득실차",
      value: formattedAverageGoalDifference,
      valueClassName:
        Number(averageGoalDifference) > 0
          ? "text-emerald-600"
          : Number(averageGoalDifference) < 0
            ? "text-rose-600"
            : "text-stone-900",
    },
  ];

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
            경기 지표
          </h2>
          <p className="mt-1 text-xs text-stone-400 sm:text-sm">
            경기당 득점과 실점 흐름이에요.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500 sm:px-3 sm:text-xs">
          총 {summary.total}경기 기준
        </span>
      </div>

      <div className="mt-4 divide-y divide-stone-100 sm:mt-5 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0 sm:block sm:px-3 sm:py-1 sm:text-center first:sm:pl-0 last:sm:pr-0"
          >
            <p className="text-xs font-medium text-stone-500 sm:text-sm">
              {item.label}
            </p>
            <p
              className={`text-2xl font-bold ${item.valueClassName} sm:mt-2 sm:text-3xl`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

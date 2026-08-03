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
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">경기 지표</h2>
          <p className="mt-1 text-sm text-stone-400">
            경기당 득점과 실점 흐름이에요.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
          총 {summary.total}경기 기준
        </span>
      </div>

      <div className="mt-5 grid divide-y divide-stone-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="px-3 py-4 first:pl-0 last:pr-0 sm:py-1 sm:text-center"
          >
            <p className="text-sm font-medium text-stone-500">{item.label}</p>
            <p className={`mt-2 text-3xl font-bold ${item.valueClassName}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

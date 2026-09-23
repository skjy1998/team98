import { getVoteSummary } from "@/lib/matches/match-vote";

interface DashboardVoteSummaryProps {
  summary: ReturnType<typeof getVoteSummary>;
}

export default function DashboardVoteSummary({
  summary,
}: Readonly<DashboardVoteSummaryProps>) {
  const { attend, pending, absent, unvoted, total } = summary;

  const respondedCount = attend + pending + absent;

  const attendRate = total > 0 ? Math.round((attend / total) * 100) : 0;

  const getWidth = (count: number) => (total > 0 ? (count / total) * 100 : 0);

  const statusItems = [
    {
      label: "참석",
      count: attend,
      barClassName: "bg-emerald-400",
    },
    {
      label: "미정",
      count: pending,
      barClassName: "bg-amber-300",
    },
    {
      label: "불참",
      count: absent,
      barClassName: "bg-rose-400",
    },
    {
      label: "미투표",
      count: unvoted,
      barClassName: "bg-stone-300",
    },
  ];

  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex items-end justify-between gap-3">
        <span className="text-xs font-extrabold text-emerald-500 sm:text-sm">
          참석 {attendRate}%
        </span>

        <span className="text-xs font-semibold text-stone-500 sm:text-sm">
          {respondedCount}/{total}명 응답
        </span>
      </div>

      <div className="mt-3.5 flex h-5 overflow-hidden rounded bg-stone-100 sm:mt-4 sm:h-6">
        {statusItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-center text-xs font-bold text-white sm:text-sm ${item.barClassName}`}
            style={{ width: `${getWidth(item.count)}%` }}
          >
            {item.count > 0 ? item.count : ""}
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-medium text-stone-500 sm:mt-3 sm:gap-4 sm:text-sm">
        {statusItems.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${item.barClassName}`} />
            {item.label} {item.count}
          </span>
        ))}
      </div>
    </div>
  );
}

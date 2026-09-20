import type { VoteSummary } from "@/types/match-vote";

interface VoteSummaryCardProps {
  summary: VoteSummary;
}

type SummaryStatus = Exclude<keyof VoteSummary, "total">;

const summaryMeta: {
  status: SummaryStatus;
  label: string;
  textClassName: string;
  barClassName: string;
}[] = [
  {
    status: "attend",
    label: "참석",
    textClassName: "text-emerald-600",
    barClassName: "bg-emerald-500",
  },
  {
    status: "pending",
    label: "미정",
    textClassName: "text-amber-600",
    barClassName: "bg-amber-400",
  },
  {
    status: "absent",
    label: "불참",
    textClassName: "text-rose-600",
    barClassName: "bg-rose-500",
  },
  {
    status: "unvoted",
    label: "미투표",
    textClassName: "text-stone-500",
    barClassName: "bg-stone-300",
  },
];

export default function VoteSummaryCard({
  summary,
}: Readonly<VoteSummaryCardProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
      <div
        aria-hidden="true"
        className="flex h-2.5 overflow-hidden rounded-xl border border-stone-200 sm:h-3"
      >
        {summaryMeta.map((item) => {
          const rate =
            summary.total > 0
              ? (summary[item.status] / summary.total) * 100
              : 0;

          return (
            <div
              key={item.status}
              className={item.barClassName}
              style={{ width: `${rate}%` }}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-4 divide-x divide-stone-200">
        {summaryMeta.map((item) => (
          <div
            key={item.status}
            className="px-1 py-3 text-center sm:px-4 sm:py-5"
          >
            <p
              className={`text-2xl font-bold sm:text-3xl ${item.textClassName}`}
            >
              {summary[item.status]}
            </p>
            <p className="mt-1 text-[11px] text-stone-500 sm:text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-stone-400 sm:mt-4 sm:text-sm">
        총 {summary.total}명
      </p>
    </section>
  );
}

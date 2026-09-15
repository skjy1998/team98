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
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div
        aria-hidden="true"
        className="flex h-3 overflow-hidden rounded-xl border border-stone-200"
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
          <div key={item.status} className="px-4 py-5 text-center">
            <p className={`text-3xl font-bold ${item.textClassName}`}>
              {summary[item.status]}
            </p>
            <p className="mt-1 text-sm text-stone-500">{item.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-stone-400">
        총 {summary.total}명
      </p>
    </section>
  );
}

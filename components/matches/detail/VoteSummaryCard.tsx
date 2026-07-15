interface VoteSummaryCardProps {
  attend: number;
  pending: number;
  absent: number;
  unvoted: number;
  total: number;
}

export default function VoteSummaryCard({
  attend,
  pending,
  absent,
  unvoted,
  total,
}: Readonly<VoteSummaryCardProps>) {
  const attendRate = total > 0 ? (attend / total) * 100 : 0;
  const pendingRate = total > 0 ? (pending / total) * 100 : 0;
  const absentRate = total > 0 ? (absent / total) * 100 : 0;
  const unvotedRate = total > 0 ? (unvoted / total) * 100 : 0;

  const summaryItems = [
    { label: "참석", value: attend, textClassName: "text-emerald-600" },
    { label: "미정", value: pending, textClassName: "text-amber-600" },
    { label: "불참", value: absent, textClassName: "text-rose-600" },
    { label: "미투표", value: unvoted, textClassName: "text-stone-500" },
  ];
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="overflow-hidden rounded-xl border border-stone-200">
        <div className="flex h-3 w-full">
          <div className="bg-emerald-500" style={{ width: `${attendRate}%` }} />
          <div className="bg-amber-400" style={{ width: `${pendingRate}%` }} />
          <div className="bg-rose-500" style={{ width: `${absentRate}%` }} />
          <div className="bg-stone-300" style={{ width: `${unvotedRate}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-stone-200 bg-white">
        {summaryItems.map((item) => (
          <div key={item.label} className="px-4 py-5 text-center">
            <p className={`text-3xl font-bold ${item.textClassName}`}>
              {item.value}
            </p>
            <p className="mt-1 text-sm text-stone-500">{item.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-stone-400">총 {total}명</p>
    </section>
  );
}

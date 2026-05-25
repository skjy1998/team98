interface VoteSummaryCardProps {
  attend: number;
  pending: number;
  absent: number;
  total: number;
}

export default function VoteSummaryCard({
  attend,
  pending,
  absent,
  total,
}: Readonly<VoteSummaryCardProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="overflow-hidden rounded-xl border border-stone-200">
        <div className="flex h-3 w-full">
          <div
            className="bg-emerald-500"
            style={{ width: `${(attend / total) * 100}%` }}
          />
          <div
            className="bg-amber-400"
            style={{ width: `${(pending / total) * 100}%` }}
          />
          <div
            className="bg-rose-500"
            style={{ width: `${(absent / total) * 100}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-stone-200 bg-white">
        <div className="px-4 py-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{attend}</p>
          <p className="mt-1 text-sm text-stone-500">참석</p>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{pending}</p>
          <p className="mt-1 text-sm text-stone-500">미정</p>
        </div>
        <div className="px-4 py-5 text-center">
          <p className="text-3xl font-bold text-rose-500">{absent}</p>
          <p className="mt-1 text-sm text-stone-500">불참</p>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-stone-400">총 {total}명</p>
    </section>
  );
}

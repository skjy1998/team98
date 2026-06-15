interface StatsRankingItem {
  id: string;
  name: string;
  value: number;
}

interface StatsRankingCardProps {
  title: string;
  items: StatsRankingItem[];

  barClassName: string;
}

export default function StatsRankingCard({
  title,
  items,

  barClassName,
}: Readonly<StatsRankingCardProps>) {
  const getRankBadgeClassName = (rank: number) => {
    if (rank === 0) return "bg-amber-100 text-amber-700";
    if (rank === 1) return "bg-slate-200 text-slate-700";
    return "bg-orange-200 text-orange-700";
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-stone-900">{title}</h3>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${getRankBadgeClassName(index)}`}
                >
                  {index + 1}
                </span>
                <p className="text-base font-medium text-stone-900">
                  {item.name}
                </p>
              </div>
              <p className="text-2xl font-semibold text-stone-900">
                {item.value}
              </p>
            </div>
            <div className="h-3 rounded-full bg-stone-100">
              <div
                className={`h-3 rounded-full ${barClassName}`}
                style={{
                  width: `${
                    items[0]?.value ? (item.value / items[0].value) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

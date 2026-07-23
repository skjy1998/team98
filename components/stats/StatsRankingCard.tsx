import type { RankingItem } from "@/types/stats";

interface StatsRankingCardProps {
  title: string;
  items: RankingItem[];
  barClassName: string;
}

const rankBadgeClassNames = [
  "border border-amber-200 bg-amber-50 text-amber-700",
  "border border-slate-200 bg-slate-50 text-slate-700",
  "border border-orange-200 bg-orange-50 text-orange-700",
] as const;

function getUnitLabel(title: string) {
  if (title.includes("득점")) return "골";
  if (title.includes("어시스트")) return "도움";
  if (title.includes("출전")) return "경기";
  return "";
}

export default function StatsRankingCard({
  title,
  items,
  barClassName,
}: Readonly<StatsRankingCardProps>) {
  const topValue = items[0]?.value ?? 0;
  const unitLabel = getUnitLabel(title);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        <span className="text-xs font-medium text-stone-400">TOP 3</span>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => {
          const badgeClassName =
            rankBadgeClassNames[index] ??
            "border border-stone-200 bg-stone-50 text-stone-600";
          const barWidth = topValue > 0 ? (item.value / topValue) * 100 : 0;
          const isFirst = index === 0;

          return (
            <div
              key={item.id}
              className={`rounded-lg px-3 py-3 ${isFirst ? "bg-stone-50" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${badgeClassName}`}
                  >
                    {index + 1}
                  </span>
                  <p className="truncate text-sm font-medium text-stone-900">
                    {item.name}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xl font-semibold text-stone-900">
                    {item.value}
                  </span>
                  <span className="ml-1 text-xs text-stone-400">
                    {unitLabel}
                  </span>
                </div>
              </div>

              <div className="mt-2 h-2 rounded-full bg-stone-100">
                <div
                  className={`h-2 rounded-full ${barClassName}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

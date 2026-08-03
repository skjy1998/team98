import type { RankingItem } from "@/types/stats";
import { Crown } from "lucide-react";

interface StatsRankingCardProps {
  title: string;
  items: RankingItem[];
  unitLabel: string;
  leaderClassName: string;
  valueClassName: string;
}

function getItemRank(items: RankingItem[], item: RankingItem) {
  const higherCount = items.filter(
    (candidate) => candidate.value > item.value,
  ).length;

  return higherCount + 1;
}

export default function StatsRankingCard({
  title,
  items,
  unitLabel,
  leaderClassName,
  valueClassName,
}: Readonly<StatsRankingCardProps>) {
  const rankedItems = items.filter((item) => item.value > 0);
  const leader = rankedItems[0];

  const leaders = leader
    ? rankedItems.filter((item) => item.value === leader.value)
    : [];

  const remainingItems = leader
    ? rankedItems.filter((item) => item.value !== leader.value).slice(0, 4)
    : [];

  const isJointLeader = leaders.length > 1;
  const leaderNames = leaders.map((item) => item.name).join(" · ");

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-stone-900">{title}</h3>
        <span className="text-xs font-medium text-stone-400">상위 기록</span>
      </div>

      {!leader ? (
        <div className="flex min-h-44 items-center justify-center text-sm text-stone-400">
          아직 집계된 선수 기록이 없어요.
        </div>
      ) : (
        <>
          <div className={`mt-4 rounded-xl border p-4 ${leaderClassName}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80">
                  <Crown className={`h-4 w-4 ${valueClassName}`} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-500">
                    {isJointLeader ? "공동 1위" : "1위"}
                  </p>
                  <p
                    className="mt-0.5 truncate font-semibold text-stone-900"
                    title={leaderNames}
                  >
                    {leaderNames}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className={`text-3xl font-bold ${valueClassName}`}>
                  {leader.value}
                </span>
                <span className="ml-1 text-xs font-medium text-stone-500">
                  {unitLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 divide-y divide-stone-100">
            {remainingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-500">
                    {getItemRank(rankedItems, item)}
                  </span>
                  <p className="truncate text-sm font-medium text-stone-800">
                    {item.name}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-stone-700">
                  {item.value}
                  <span className="ml-1 text-xs font-normal text-stone-400">
                    {unitLabel}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

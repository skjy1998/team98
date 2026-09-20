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
    <div className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-900 sm:text-base">
          {title}
        </h3>
        <span className="text-xs font-medium text-stone-400">상위 기록</span>
      </div>

      {!leader ? (
        <div className="flex min-h-28 items-center justify-center text-xs text-stone-400 sm:min-h-44 sm:text-sm">
          아직 집계된 선수 기록이 없어요.
        </div>
      ) : (
        <>
          <div
            className={`mt-3 rounded-xl border p-3 sm:mt-4 sm:p-4 ${leaderClassName}`}
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 sm:h-9 sm:w-9">
                  <Crown
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${valueClassName}`}
                  />
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
                <span
                  className={`text-2xl font-bold sm:text-3xl ${valueClassName}`}
                >
                  {leader.value}
                </span>
                <span className="ml-1 text-xs font-medium text-stone-500">
                  {unitLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 divide-y divide-stone-100 sm:mt-3">
            {remainingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 py-2.5 sm:py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-semibold text-stone-500 sm:h-7 sm:w-7 sm:text-xs">
                    {getItemRank(rankedItems, item)}
                  </span>
                  <p className="truncate text-xs font-medium text-stone-800 sm:text-sm">
                    {item.name}
                  </p>
                </div>

                <p className="shrink-0 text-xs font-semibold text-stone-700 sm:text-sm">
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

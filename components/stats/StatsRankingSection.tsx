import type { RankingItem } from "@/types/stats";
import StatsRankingCard from "./StatsRankingCard";

interface StatsRankingSectionProps {
  scorerRankingItems: RankingItem[];
  assisterRankingItems: RankingItem[];
  mvpRankingItems: RankingItem[];
}

export default function StatsRankingSection({
  scorerRankingItems,
  assisterRankingItems,
  mvpRankingItems,
}: Readonly<StatsRankingSectionProps>) {
  const rankingCards = [
    {
      title: "득점 리더",
      items: scorerRankingItems,
      unitLabel: "골",
      leaderClassName: "border-emerald-100 bg-emerald-50",
      valueClassName: "text-emerald-700",
    },
    {
      title: "도움 리더",
      items: assisterRankingItems,
      unitLabel: "도움",
      leaderClassName: "border-sky-100 bg-sky-50",
      valueClassName: "text-sky-700",
    },
    {
      title: "MVP 리더",
      items: mvpRankingItems,
      unitLabel: "회",
      leaderClassName: "border-amber-100 bg-amber-50",
      valueClassName: "text-amber-700",
    },
  ];

  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold text-stone-900">팀 리더</h2>
        <p className="mt-1 text-sm text-stone-400">
          주요 기록에서 앞서고 있는 선수들이에요.
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {rankingCards.map((card) => (
          <StatsRankingCard
            key={card.title}
            title={card.title}
            items={card.items}
            unitLabel={card.unitLabel}
            leaderClassName={card.leaderClassName}
            valueClassName={card.valueClassName}
          />
        ))}
      </div>
    </section>
  );
}

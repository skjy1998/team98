import { RankingItem } from "@/types/stats";
import StatsRankingCard from "./StatsRankingCard";

interface StatsRankingSectionProps {
  scorerRankingItems: RankingItem[];
  assisterRankingItems: RankingItem[];
  appearanceRankingItems: RankingItem[];
}

export default function StatsRankingSection({
  scorerRankingItems,
  assisterRankingItems,
  appearanceRankingItems,
}: Readonly<StatsRankingSectionProps>) {
  const rankingCards = [
    {
      title: "득점 순위",
      items: scorerRankingItems,
      barClassName: "bg-emerald-400",
    },
    {
      title: "어시스트 순위",
      items: assisterRankingItems,
      barClassName: "bg-sky-400",
    },
    {
      title: "출전 순위",
      items: appearanceRankingItems,
      barClassName: "bg-amber-400",
    },
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {rankingCards.map((card) => (
        <StatsRankingCard
          key={card.title}
          title={card.title}
          items={card.items}
          barClassName={card.barClassName}
        />
      ))}
    </section>
  );
}

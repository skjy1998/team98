import type { MatchItem } from "@/types/match";
import MatchListCard from "./MatchListCard";

interface MatchSectionProps {
  title: string;
  items: MatchItem[];
}

export default function MatchSection({
  title,
  items,
}: Readonly<MatchSectionProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-900">{title}</h2>
        <span className="text-sm text-stone-400">{items.length}개</span>
      </div>
      <div className="space-y-3">
        {items.map((match) => (
          <MatchListCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}

import type { TeamSport } from "@/types/team";
import MatchSportSelector from "../../MatchSportSelector";

interface MatchCreateSportSectionProps {
  sport: TeamSport;
  onChangeSport: (sport: TeamSport) => void;
}

export default function MatchCreateSportSection({
  sport,
  onChangeSport,
}: Readonly<MatchCreateSportSectionProps>) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold text-stone-900">경기 종목</p>
        <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
          필수
        </span>
      </div>

      <MatchSportSelector value={sport} onChange={onChangeSport} />
    </section>
  );
}

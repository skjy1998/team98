import PageHeader from "@/components/PageHeader";
import { initialMatches } from "@/data/initialMatches";
import MatchSection from "@/components/matches/MatchSection";

export default function MatchesPage() {
  const upcomingMatches = initialMatches.filter((match) => match.isUpcoming);
  const pastMatches = initialMatches.filter((match) => !match.isUpcoming);

  return (
    <div className="space-y-6">
      <PageHeader
        title="경기 일정"
        description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
      />

      <div className="rounded-[28px] border border-stone-200 bg-white p-4 md:p-6">
        <div className="space-y-8">
          <MatchSection title="다가오는 경기" items={upcomingMatches} />
          <MatchSection title="지난 경기" items={pastMatches} />
        </div>
      </div>
    </div>
  );
}

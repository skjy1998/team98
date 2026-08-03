import type {
  RankingItem,
  RecentResult,
  TeamHighlights,
  TeamSummary,
} from "@/types/stats";
import StatsRankingSection from "./StatsRankingSection";
import TeamSummaryCard from "./TeamSummaryCard";
import TeamHighlightsCard from "./TeamHighlightsCard";
import TeamMetricsCard from "./TeamMetricsCard";

interface TeamStatsTabProps {
  data: {
    teamSummary: TeamSummary;
    recentResults: RecentResult[];
    teamHighlights: TeamHighlights;
    scorerRankingItems: RankingItem[];
    assisterRankingItems: RankingItem[];
    appearanceStreakRankingItems: RankingItem[];
  };
}

export default function TeamStatsTab({ data }: Readonly<TeamStatsTabProps>) {
  const {
    teamSummary,
    recentResults,
    teamHighlights,
    scorerRankingItems,
    assisterRankingItems,
    appearanceStreakRankingItems,
  } = data;

  return (
    <div className="space-y-6">
      <TeamSummaryCard summary={teamSummary} recentResults={recentResults} />
      <TeamMetricsCard summary={teamSummary} />
      <TeamHighlightsCard highlights={teamHighlights} />
      <StatsRankingSection
        scorerRankingItems={scorerRankingItems}
        assisterRankingItems={assisterRankingItems}
        appearanceStreakRankingItems={appearanceStreakRankingItems}
      />
    </div>
  );
}

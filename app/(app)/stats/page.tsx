"use client";
import PageHeader from "@/components/PageHeader";
import StatsPlayerTable from "@/components/stats/StatsPlayerTable";
import StatsRankingSection from "@/components/stats/StatsRankingSection";
import TeamSummaryCard from "@/components/stats/TeamSummaryCard";
import { useMatches } from "@/hooks/useMatches";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";
import { useMatchVotes } from "@/hooks/useMatchVotes";
import { usePlayers } from "@/hooks/usePlayers";
import {
  getPlayerStats,
  getRankingItems,
  getRankPlayerStats,
  getRecentResults,
  getTeamSummary,
  getTopAppearances,
  getTopAssisters,
  getTopScorers,
} from "@/lib/stats";

import { useMemo } from "react";

export default function StatPage() {
  const { matches, matchesLoaded } = useMatches();
  const { players, playersLoaded } = usePlayers();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { votes, votesLoaded } = useMatchVotes();

  // 최근 5경기 결과 계산
  const recentResults = useMemo(
    () => getRecentResults(matches, records),
    [matches, records],
  );

  // 전적 계산
  const teamSummary = useMemo(
    () => getTeamSummary(matches, records),
    [matches, records],
  );

  // 선수 통계 기준 배열
  // 득점 순위 top3
  // 어시스트 순위 top3
  // 출전 순위 top3
  // 표용 정렬 배열
  const { topScorers, topAssisters, topAppearances, rankedPlayerStats } =
    useMemo(() => {
      const playerStats = getPlayerStats(players, matches, votes, records);

      return {
        topScorers: getTopScorers(playerStats),
        topAssisters: getTopAssisters(playerStats),
        topAppearances: getTopAppearances(playerStats),
        rankedPlayerStats: getRankPlayerStats(playerStats),
      };
    }, [players, matches, votes, records]);

  const scorerRankingItems = getRankingItems(topScorers, "goal");
  const assisterRankingItems = getRankingItems(topAssisters, "assist");
  const appearanceRankingItems = getRankingItems(topAppearances, "appearance");

  if (!matchesLoaded || !playersLoaded || !recordsLoaded || !votesLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="통계"
          description="팀 전적과 선수 랭킹을 한눈에 확인하세요."
        />
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          통계 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="통계"
        description="팀 전적과 선수 랭킹을 한눈에 확인하세요."
      />
      <TeamSummaryCard
        win={teamSummary.win}
        draw={teamSummary.draw}
        lose={teamSummary.lose}
        winRate={teamSummary.winRate}
        goals={teamSummary.goals}
        conceded={teamSummary.conceded}
        goalDiff={teamSummary.goalDiff}
        recentResults={recentResults}
      />
      <StatsRankingSection
        scorerRankingItems={scorerRankingItems}
        assisterRankingItems={assisterRankingItems}
        appearanceRankingItems={appearanceRankingItems}
      />
      <StatsPlayerTable players={rankedPlayerStats} />
    </div>
  );
}

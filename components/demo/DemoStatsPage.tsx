"use client";

import { useDemoData } from "@/components/demo/DemoModeProvider";
import PageHeader from "@/components/PageHeader";
import SeasonSelect from "@/components/common/SeasonSelect";
import MyStatsTab from "@/components/stats/MyStatsTab";
import StatsPlayerTable from "@/components/stats/StatsPlayerTable";
import StatsTabs from "@/components/stats/StatsTabs";
import TeamStatsTab from "@/components/stats/TeamStatsTab";
import { demoSeasons } from "@/lib/demo/demo-matches-data";
import { getHasMatchEnded } from "@/lib/matches/match-time";
import { getPlayerMvpWinCounts } from "@/lib/matches/match-mvp";
import {
  getPlayerRecentMatches,
  getPlayerStats,
} from "@/lib/players/player-stats";
import {
  getAppearanceRanking,
  getAssisterRanking,
  getMvpRankingItems,
  getPlayerRank,
  getRankPlayerStats,
  getRankingItems,
  getScorerRanking,
} from "@/lib/stats/ranking-stats";
import {
  getRecentResults,
  getTeamHighlights,
  getTeamSummary,
} from "@/lib/stats/team-stats";
import type { StatsTab } from "@/types/stats";
import { useState } from "react";

export default function DemoStatsPage() {
  const { players, matches, matchAttendance, matchRecords, matchMvpVotes } =
    useDemoData();

  const [activeTab, setActiveTab] = useState<StatsTab>("team");
  const [seasonId, setSeasonId] = useState(
    demoSeasons.find((season) => season.isActive)?.id ?? "",
  );

  const seasonMatches = matches.filter((match) => match.seasonId === seasonId);

  const mvpMatchIds = seasonMatches
    .filter(
      (match) =>
        match.status !== "canceled" &&
        getHasMatchEnded(match.date, match.endTime),
    )
    .map((match) => match.id);

  const mvpWinCounts = getPlayerMvpWinCounts(
    mvpMatchIds,
    players,
    matchAttendance,
    matchMvpVotes,
  );

  const playerStats = getPlayerStats(
    players,
    seasonMatches,
    matchAttendance,
    matchRecords,
  ).map((player) => ({
    ...player,
    mvpCount: mvpWinCounts[player.id] ?? 0,
  }));

  const rankedPlayerStats = getRankPlayerStats(playerStats);
  const scorerRanking = getScorerRanking(playerStats);
  const assisterRanking = getAssisterRanking(playerStats);
  const appearanceRanking = getAppearanceRanking(playerStats);

  const myPlayer = rankedPlayerStats.find(
    (player) => player.userId === "demo-user",
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="통계"
        description="팀 전적과 선수 랭킹을 한눈에 확인하세요."
      />

      <div className="flex items-center gap-2 sm:gap-3">
        <SeasonSelect
          seasons={demoSeasons}
          selectedSeasonId={seasonId}
          ariaLabel="통계 시즌 선택"
          onChange={setSeasonId}
        />
        <span className="text-xs text-stone-500 sm:text-sm">시즌 기록</span>
      </div>

      <StatsTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {activeTab === "team" && (
        <TeamStatsTab
          data={{
            teamSummary: getTeamSummary(seasonMatches, matchRecords),
            recentResults: getRecentResults(seasonMatches, matchRecords),
            teamHighlights: getTeamHighlights(seasonMatches, matchRecords),
            scorerRankingItems: getRankingItems(scorerRanking, "goal"),
            assisterRankingItems: getRankingItems(assisterRanking, "assist"),
            mvpRankingItems: getMvpRankingItems(playerStats),
          }}
        />
      )}

      {activeTab === "me" && (
        <MyStatsTab
          data={{
            player: myPlayer,
            goalRank: getPlayerRank(scorerRanking, myPlayer?.id, "goal"),
            assistRank: getPlayerRank(assisterRanking, myPlayer?.id, "assist"),
            appearanceRank: getPlayerRank(
              appearanceRanking,
              myPlayer?.id,
              "appearance",
            ),
            recentMatches: getPlayerRecentMatches(
              myPlayer?.id,
              seasonMatches,
              matchAttendance,
              matchRecords,
            ),
          }}
        />
      )}

      {activeTab === "ranking" && (
        <StatsPlayerTable
          players={rankedPlayerStats}
          currentPlayerId={myPlayer?.id}
        />
      )}
    </div>
  );
}

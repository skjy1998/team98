import { useMemo } from "react";
import { useMatches } from "../matches/useMatches";
import useMatchRecordsMap from "../matches/useMatchRecordMap";
import { usePlayers } from "../players/usePlayers";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import {
  getAppearanceRanking,
  getAppearanceStreakRanking,
  getAssisterRanking,
  getPlayerRank,
  getRankingItems,
  getRankPlayerStats,
  getScorerRanking,
} from "@/lib/stats/ranking-stats";
import { useMatchAttendance } from "../matches/useMatchAttendance";
import {
  getRecentResults,
  getTeamHighlights,
  getTeamSummary,
} from "@/lib/stats/team-stats";
import {
  getPlayerRecentMatches,
  getPlayerStats,
} from "@/lib/players/player-stats";

export default function useStatsPageData(seasonId?: string) {
  const { matches, matchesLoaded } = useMatches({ seasonId });
  const { players, playersLoaded } = usePlayers();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { attendance, attendanceLoaded } = useMatchAttendance();
  const { member, memberLoaded } = useCurrentTeamMember();

  const statsData = useMemo(() => {
    const recentResults = getRecentResults(matches, records);
    const teamSummary = getTeamSummary(matches, records);

    const playerStats = getPlayerStats(players, matches, attendance, records);
    const teamHighlights = getTeamHighlights(matches, records);

    const scorerRanking = getScorerRanking(playerStats);
    const assisterRanking = getAssisterRanking(playerStats);
    const appearanceRanking = getAppearanceRanking(playerStats);
    const appearanceStreakRanking = getAppearanceStreakRanking(playerStats);

    const rankedPlayerStats = getRankPlayerStats(playerStats);

    const myPlayerStats = rankedPlayerStats.find(
      (player) => player.userId === member?.userId,
    );

    const myRecentMatches = getPlayerRecentMatches(
      myPlayerStats?.id,
      matches,
      attendance,
      records,
    );

    return {
      rankedPlayerStats,

      myStats: {
        player: myPlayerStats,
        recentMatches: myRecentMatches,
        goalRank: getPlayerRank(scorerRanking, myPlayerStats?.id, "goal"),
        assistRank: getPlayerRank(assisterRanking, myPlayerStats?.id, "assist"),
        appearanceRank: getPlayerRank(
          appearanceRanking,
          myPlayerStats?.id,
          "appearance",
        ),
      },

      teamStats: {
        teamSummary,
        recentResults,
        teamHighlights,
        scorerRankingItems: getRankingItems(scorerRanking, "goal"),
        assisterRankingItems: getRankingItems(assisterRanking, "assist"),
        appearanceStreakRankingItems: getRankingItems(
          appearanceStreakRanking,
          "appearanceStreak",
        ),
      },
    };
  }, [matches, players, records, attendance, member?.userId]);

  const isLoaded =
    matchesLoaded &&
    playersLoaded &&
    recordsLoaded &&
    attendanceLoaded &&
    memberLoaded;

  return {
    ...statsData,
    isLoaded,
  };
}

import { useMemo } from "react";
import { useMatches } from "../matches/useMatches";
import useMatchRecordsMap from "../matches/useMatchRecordMap";
import { usePlayers } from "../players/usePlayers";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import {
  getAppearanceRanking,
  getAssisterRanking,
  getMvpRankingItems,
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
import { useMatchMvpVotes } from "../matches/useMatchMvpVotes";
import { getHasMatchEnded } from "@/lib/matches/match-time";
import { getPlayerMvpWinCounts } from "@/lib/matches/match-mvp";

export default function useStatsPageData(seasonId?: string) {
  const { matches, matchesLoaded, matchesError, reloadMatches } = useMatches({
    seasonId,
  });
  const { players, playersLoaded, playersError, reloadPlayers } = usePlayers();
  const { records, recordsLoaded, recordsError, reloadRecords } =
    useMatchRecordsMap();
  const { attendance, attendanceLoaded, attendanceError, reloadAttendance } =
    useMatchAttendance();
  const { mvpVotes, mvpVotesLoaded, mvpVotesError, reloadMvpVotes } =
    useMatchMvpVotes();
  const { member, memberLoaded, memberError, reloadMember } =
    useCurrentTeamMember();

  const statsData = useMemo(() => {
    const recentResults = getRecentResults(matches, records);
    const teamSummary = getTeamSummary(matches, records);

    const mvpMatchIds = matches
      .filter(
        (match) =>
          match.status !== "canceled" &&
          getHasMatchEnded(match.date, match.endTime),
      )
      .map((match) => match.id);

    const mvpWinCounts = getPlayerMvpWinCounts(
      mvpMatchIds,
      players,
      attendance,
      mvpVotes,
    );
    const playerStats = getPlayerStats(
      players,
      matches,
      attendance,
      records,
    ).map((player) => ({
      ...player,
      mvpCount: mvpWinCounts[player.id] ?? 0,
    }));
    const teamHighlights = getTeamHighlights(matches, records);

    const scorerRanking = getScorerRanking(playerStats);
    const assisterRanking = getAssisterRanking(playerStats);
    const appearanceRanking = getAppearanceRanking(playerStats);

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
        mvpRankingItems: getMvpRankingItems(playerStats),
      },
    };
  }, [matches, players, records, attendance, mvpVotes, member?.userId]);

  const isLoaded =
    matchesLoaded &&
    playersLoaded &&
    recordsLoaded &&
    attendanceLoaded &&
    mvpVotesLoaded &&
    memberLoaded;

  const pageError =
    matchesError ||
    playersError ||
    recordsError ||
    attendanceError ||
    mvpVotesError ||
    memberError;

  const reloadPageData = async () => {
    await Promise.all([
      reloadMatches(),
      reloadPlayers(),
      reloadRecords(),
      reloadAttendance(),
      reloadMvpVotes(),
      reloadMember(),
    ]);
  };

  return {
    ...statsData,
    isLoaded,
    pageError,
    reloadPageData,
  };
}

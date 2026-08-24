import type { MatchItem, MatchRecordMap } from "@/types/match";
import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import type { PlayerType } from "@/types/player";
import { getPlayerStats } from "../players/player-stats";
import { getRecentResults, getTeamSummary } from "../stats/team-stats";
import {
  getTopAppearances,
  getTopAssisters,
  getTopScorers,
} from "../stats/ranking-stats";

interface GetDashboardStatsDataParams {
  players: PlayerType[];
  matches: MatchItem[];
  attendance: MatchAttendanceByMatchId;
  records: MatchRecordMap;
  currentUserId?: string;
}

export function getDashboardStatsData({
  players,
  matches,
  attendance,
  records,
  currentUserId,
}: GetDashboardStatsDataParams) {
  const playerStats = getPlayerStats(players, matches, attendance, records);

  return {
    recentResults: getRecentResults(matches, records),
    teamSummary: getTeamSummary(matches, records),
    myPlayer: playerStats.find((player) => player.userId === currentUserId),
    topScorer: getTopScorers(playerStats).find((player) => player.goal > 0),
    topAssister: getTopAssisters(playerStats).find(
      (player) => player.assist > 0,
    ),
    topAppearance: getTopAppearances(playerStats).find(
      (player) => player.appearance > 0,
    ),
  };
}

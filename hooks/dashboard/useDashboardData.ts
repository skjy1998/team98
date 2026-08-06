import { useMemo } from "react";
import { useFinanceSettings } from "../finance/useFinanceSettings";
import { useMatches } from "../matches/useMatches";
import useMatchRecordsMap from "../matches/useMatchRecordMap";
import { useMatchVotes } from "../matches/useMatchVotes";
import { usePlayers } from "../players/usePlayers";
import {
  getFinanceDefaults,
  getFinanceSummary,
  getMonthlyPaymentEntries,
  getPaymentStatusRows,
  getPaymentSummary,
} from "@/lib/finance/finance";
import { getDisplayMatches } from "@/lib/matches/match-ui";
import {
  getTopAppearances,
  getTopAssisters,
  getTopScorers,
} from "@/lib/stats/ranking-stats";
import { useFinanceEntries } from "../finance/useFinanceEntries";
import { useMatchAttendance } from "../matches/useMatchAttendance";
import { getRecentResults, getTeamSummary } from "@/lib/stats/team-stats";
import { getPlayerStats } from "@/lib/players/player-stats";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import type { VoteStatus } from "@/types/match-vote";
import {
  getDashboardRecentMatch,
  getDashboardUpcomingMatches,
} from "@/lib/dashboard/dashboard-data";

export function useDashboardData() {
  const { players, playersLoaded } = usePlayers();
  const { matches, matchesLoaded } = useMatches();
  const { votes, votesLoaded, saveVote, deleteVote } = useMatchVotes();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { entries, entriesLoaded } = useFinanceEntries();
  const { attendance, attendanceLoaded } = useMatchAttendance();
  const { settingsLoaded } = useFinanceSettings();
  const { member, memberLoaded } = useCurrentTeamMember();

  const { defaultMonth } = useMemo(() => getFinanceDefaults(), []);

  const displayMatches = useMemo(
    () => getDisplayMatches(matches, records),
    [matches, records],
  );

  const upcomingMatches = useMemo(
    () => getDashboardUpcomingMatches(displayMatches),
    [displayMatches],
  );

  const recentResults = useMemo(
    () => getRecentResults(matches, records),
    [matches, records],
  );

  const recentMatch = useMemo(
    () => getDashboardRecentMatch(displayMatches),
    [displayMatches],
  );

  const teamSummary = useMemo(
    () => getTeamSummary(matches, records),
    [matches, records],
  );

  const playerStats = useMemo(
    () => getPlayerStats(players, matches, attendance, records),
    [players, matches, attendance, records],
  );

  const myPlayer = useMemo(
    () => playerStats.find((player) => player.userId === member?.userId),
    [playerStats, member?.userId],
  );

  const { topAppearance, topScorer, topAssister } = useMemo(
    () => ({
      topScorer: getTopScorers(playerStats).find((player) => player.goal > 0),
      topAssister: getTopAssisters(playerStats).find(
        (player) => player.assist > 0,
      ),
      topAppearance: getTopAppearances(playerStats).find(
        (player) => player.appearance > 0,
      ),
    }),
    [playerStats],
  );

  const financeSummary = useMemo(
    () => getFinanceSummary(entries, defaultMonth),
    [entries, defaultMonth],
  );

  const paymentSummary = useMemo(() => {
    const monthlyPaymentEntries = getMonthlyPaymentEntries(
      entries,
      defaultMonth,
    );
    const paymentStatusRows = getPaymentStatusRows(
      players,
      monthlyPaymentEntries,
    );

    return getPaymentSummary(paymentStatusRows);
  }, [entries, players, defaultMonth]);

  const changeMyVote = async (matchId: string, status: VoteStatus) => {
    if (!myPlayer) return false;

    const currentStatus =
      votes[matchId]?.find((vote) => vote.playerId === myPlayer.id)?.status ??
      "unvoted";

    if (currentStatus === status) {
      return deleteVote(matchId, myPlayer.id);
    }

    return saveVote(matchId, myPlayer.id, status);
  };

  const isLoaded =
    playersLoaded &&
    matchesLoaded &&
    votesLoaded &&
    attendanceLoaded &&
    recordsLoaded &&
    entriesLoaded &&
    settingsLoaded &&
    memberLoaded;

  return {
    matchData: {
      players,
      myPlayer,
      votes,
      upcomingMatches,
      recentMatch,
      onChangeMyVote: changeMyVote,
    },
    statsData: {
      recentResults,
      teamSummary,
      topAppearance,
      topScorer,
      topAssister,
    },
    financeData: {
      financeSummary,
      paymentSummary,
    },
    isLoaded,
  };
}

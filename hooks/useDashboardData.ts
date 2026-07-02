import { useMemo } from "react";
import { useFinanceEntries } from "./useFinanceEntries";
import { useFinanceSettings } from "./useFinanceSettings";
import { useMatches } from "./useMatches";
import useMatchRecordsMap from "./useMatchRecordMap";
import { useMatchVotes } from "./useMatchVotes";
import { usePlayers } from "./usePlayers";
import {
  getFinanceDefaults,
  getFinanceSummary,
  getMonthlyPaymentEntries,
  getPaymentStatusRows,
  getPaymentSummary,
} from "@/lib/finance";
import { getDisplayMatches, getIsUpcomingMatch } from "@/lib/match-ui";
import {
  getPlayerStats,
  getRecentResults,
  getTeamSummary,
  getTopAppearances,
  getTopAssisters,
  getTopScorers,
} from "@/lib/stats";

export function useDashboardData() {
  const { players, playersLoaded } = usePlayers();
  const { matches, matchesLoaded } = useMatches();
  const { votes, votesLoaded } = useMatchVotes();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { entries, entriesLoaded } = useFinanceEntries();
  const { settingsLoaded } = useFinanceSettings();

  const { defaultMonth } = useMemo(() => getFinanceDefaults(), []);

  const displayMatches = useMemo(
    () => getDisplayMatches(matches, records),
    [matches, records],
  );

  const upcomingMatches = useMemo(
    () => displayMatches.filter((match) => getIsUpcomingMatch(match.date)),
    [displayMatches],
  );

  const recentResults = useMemo(
    () => getRecentResults(matches, records),
    [matches, records],
  );

  const teamSummary = useMemo(
    () => getTeamSummary(matches, records),
    [matches, records],
  );

  const { topAppearance, topScorer, topAssister } = useMemo(() => {
    const playerStats = getPlayerStats(players, matches, votes, records);

    return {
      topScorer: getTopScorers(playerStats)[0],
      topAssister: getTopAssisters(playerStats)[0],
      topAppearance: getTopAppearances(playerStats)[0],
    };
  }, [players, matches, votes, records]);

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

  const isLoaded =
    playersLoaded &&
    matchesLoaded &&
    votesLoaded &&
    recordsLoaded &&
    entriesLoaded &&
    settingsLoaded;

  return {
    players,
    votes,
    upcomingMatches,
    recentResults,
    teamSummary,
    topAppearance,
    topScorer,
    topAssister,
    financeSummary,
    paymentSummary,
    isLoaded,
  };
}

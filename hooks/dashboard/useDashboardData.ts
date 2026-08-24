import { useMemo } from "react";
import { useFinanceSettings } from "../finance/useFinanceSettings";
import { useMatches } from "../matches/useMatches";
import useMatchRecordsMap from "../matches/useMatchRecordMap";
import { useMatchVotes } from "../matches/useMatchVotes";
import { usePlayers } from "../players/usePlayers";
import { getFinanceDefaults } from "@/lib/finance/finance";
import { useFinanceEntries } from "../finance/useFinanceEntries";
import { useMatchAttendance } from "../matches/useMatchAttendance";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import type { VoteStatus } from "@/types/match-vote";
import {
  getDashboardMatchData,
  getDashboardTodoItems,
} from "@/lib/dashboard/dashboard-data";
import { useNotificationSettings } from "../settings/useNotificationSettings";
import { useMyUnpaidFineSummary } from "../finance/useMyUnpaidFineSummary";
import { useTeamPosts } from "../board/useTeamPosts";
import { getDashboardStatsData } from "@/lib/dashboard/dashboard-stats";
import { getDashboardFinanceData } from "@/lib/dashboard/dashboard-finance";
import { getRecentNoticePost } from "@/lib/board/board-ui";
import { getPlayerVoteStatus } from "@/lib/matches/match-vote";

export function useDashboardData() {
  const { players, playersLoaded } = usePlayers();
  const { matches, matchesLoaded } = useMatches();
  const { votes, votesLoaded, saveVote, deleteVote } = useMatchVotes();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { entries, entriesLoaded } = useFinanceEntries();
  const { attendance, attendanceLoaded } = useMatchAttendance();
  const { settingsLoaded: financeSettingsLoaded } = useFinanceSettings();
  const {
    settings: notificationSettings,
    settingsLoaded: notificationSettingsLoaded,
  } = useNotificationSettings();
  const { member, memberLoaded, canManage } = useCurrentTeamMember();
  const { posts, postsLoaded } = useTeamPosts();

  const { defaultMonth } = useMemo(() => getFinanceDefaults(), []);

  const { displayMatches, upcomingMatches, recentMatch } = useMemo(
    () => getDashboardMatchData(matches, records),
    [matches, records],
  );

  const {
    recentResults,
    teamSummary,
    myPlayer,
    topAppearance,
    topScorer,
    topAssister,
  } = useMemo(
    () =>
      getDashboardStatsData({
        players,
        matches,
        attendance,
        records,
        currentUserId: member?.userId,
      }),
    [players, matches, attendance, records, member?.userId],
  );

  const { summary: unpaidFineSummary, summaryLoaded: unpaidFineSummaryLoaded } =
    useMyUnpaidFineSummary({
      playerId: myPlayer?.id,
      enabled: notificationSettings.financeEnabled,
    });

  const { financeSummary, paymentStatusRows, paymentSummary } = useMemo(
    () =>
      getDashboardFinanceData({
        entries,
        players,
        currentMonth: defaultMonth,
      }),
    [entries, players, defaultMonth],
  );

  const changeMyVote = async (matchId: string, status: VoteStatus) => {
    if (!myPlayer) return false;

    const currentStatus = getPlayerVoteStatus(
      votes[matchId] ?? [],
      myPlayer.id,
    );

    if (currentStatus === status) {
      return deleteVote(matchId, myPlayer.id);
    }

    return saveVote(matchId, myPlayer.id, status);
  };

  const todoItems = useMemo(
    () =>
      getDashboardTodoItems({
        upcomingMatches,
        displayMatches,
        votes,
        attendance,
        paymentStatusRows,
        myPlayerId: myPlayer?.id,
        currentMonth: defaultMonth,
        unpaidFineCount: unpaidFineSummary.count,
        unpaidFineAmount: unpaidFineSummary.totalAmount,
        canManage,
        notificationSettings,
      }),
    [
      upcomingMatches,
      displayMatches,
      votes,
      attendance,
      paymentStatusRows,
      myPlayer?.id,
      defaultMonth,
      unpaidFineSummary.count,
      unpaidFineSummary.totalAmount,
      canManage,
      notificationSettings,
    ],
  );

  const recentNotice = useMemo(() => getRecentNoticePost(posts), [posts]);

  const matchDataLoaded =
    playersLoaded &&
    matchesLoaded &&
    votesLoaded &&
    attendanceLoaded &&
    recordsLoaded &&
    memberLoaded;

  const financeDataLoaded =
    entriesLoaded && financeSettingsLoaded && unpaidFineSummaryLoaded;

  const settingsDataLoaded = notificationSettingsLoaded;
  const boardDataLoaded = postsLoaded;

  const isLoaded =
    matchDataLoaded &&
    financeDataLoaded &&
    settingsDataLoaded &&
    boardDataLoaded;

  return {
    todoData: {
      items: todoItems,
    },
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
    boardData: {
      recentNotice,
    },
    isLoaded,
  };
}

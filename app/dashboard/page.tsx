"use client";

import DashboardFinanceSummarySection from "@/components/dashboard/DashboardFinanceSummarySection";
import DashboardQuickLinkSection from "@/components/dashboard/DashboardQuickLinkSection";
import DashboardSeasonSummarySection from "@/components/dashboard/DashboardSeasonSummarySection";
import DashboardTopRecordSection from "@/components/dashboard/DashboardTopRecordSection";
import DashboardUpcomingMatchSection from "@/components/dashboard/DashboardUpcomingMatchSection";
import PageHeader from "@/components/PageHeader";
import { useFinanceEntries } from "@/hooks/useFinanceEntries";
import { useFinanceSettings } from "@/hooks/useFinanceSettings";
import { useMatches } from "@/hooks/useMatches";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";
import { useMatchVotes } from "@/hooks/useMatchVotes";
import { usePlayers } from "@/hooks/usePlayers";
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
import { useMemo } from "react";

export default function DashboardPage() {
  const { players, playersLoaded } = usePlayers();
  const { matches, matchesLoaded } = useMatches();
  const { votes, votesLoaded } = useMatchVotes();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { entries, loaded: financeLoaded } = useFinanceEntries();
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
    financeLoaded &&
    settingsLoaded;

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="대시보드"
          description="오늘 팀 상태와 주요 지표를 한눈에 확인하세요."
        />
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          대시보드 데이터를 불러오는 중 ...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="오늘 팀 상태와 주요 지표를 한눈에 확인하세요."
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.95fr)]">
        <div className="space-y-6">
          <DashboardUpcomingMatchSection
            upcomingMatches={upcomingMatches}
            votes={votes}
            totalPlayers={players.length}
          />
          <DashboardSeasonSummarySection
            win={teamSummary.win}
            draw={teamSummary.draw}
            lose={teamSummary.lose}
            recentResults={recentResults}
          />
        </div>
        <div className="space-y-6">
          <DashboardTopRecordSection
            topAppearance={topAppearance}
            topScorer={topScorer}
            topAssister={topAssister}
          />
          <DashboardFinanceSummarySection
            totalBalance={financeSummary.totalBalance}
            paidRate={paymentSummary.paidRate}
            paidCount={paymentSummary.paidCount}
            unpaidCount={paymentSummary.unpaidCount}
          />
        </div>
      </section>
      <DashboardQuickLinkSection />
    </div>
  );
}

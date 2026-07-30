"use client";

import DashboardFinanceSummarySection from "@/components/dashboard/DashboardFinanceSummarySection";
import DashboardQuickLinkSection from "@/components/dashboard/DashboardQuickLinkSection";
import DashboardSeasonSummarySection from "@/components/dashboard/DashboardSeasonSummarySection";
import DashboardTopRecordSection from "@/components/dashboard/DashboardTopRecordSection";
import DashboardUpcomingMatchSection from "@/components/dashboard/DashboardUpcomingMatchSection";
import PageHeader from "@/components/PageHeader";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";

export default function DashboardPage() {
  const {
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
  } = useDashboardData();

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

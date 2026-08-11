"use client";
import DashboardFinanceSummarySection from "@/components/dashboard/DashboardFinanceSummarySection";
import DashboardQuickLinkSection from "@/components/dashboard/DashboardQuickLinkSection";
import DashboardSeasonSummarySection from "@/components/dashboard/DashboardSeasonSummarySection";
import DashboardTopRecordSection from "@/components/dashboard/DashboardTopRecordSection";
import DashboardUpcomingMatchSection from "@/components/dashboard/DashboardUpcomingMatchSection";
import PageHeader from "@/components/PageHeader";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import DashboardRecentMatchBar from "./DashboardRecentMatchBar";
import DashboardMyRecordSection from "./DashboardMyRecordSection";
import DashboardTodoSection from "./DashboardTodoSection";

export default function DashboardPageClient() {
  const { todoData, matchData, statsData, financeData, isLoaded } =
    useDashboardData();

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
          <div className="space-y-3">
            <DashboardUpcomingMatchSection
              upcomingMatches={matchData.upcomingMatches}
              votes={matchData.votes}
              players={matchData.players}
              myPlayer={matchData.myPlayer}
              onChangeMyVote={matchData.onChangeMyVote}
            />
            {matchData.recentMatch && (
              <DashboardRecentMatchBar match={matchData.recentMatch} />
            )}
          </div>
          <DashboardSeasonSummarySection
            total={statsData.teamSummary.total}
            win={statsData.teamSummary.win}
            draw={statsData.teamSummary.draw}
            lose={statsData.teamSummary.lose}
            recentResults={statsData.recentResults}
          />
        </div>
        <div className="space-y-6">
          <DashboardTodoSection items={todoData.items} />
          <DashboardTopRecordSection
            topAppearance={statsData.topAppearance}
            topScorer={statsData.topScorer}
            topAssister={statsData.topAssister}
          />
          <DashboardMyRecordSection player={matchData.myPlayer} />
          <DashboardFinanceSummarySection
            totalBalance={financeData.financeSummary.totalBalance}
            paidRate={financeData.paymentSummary.paidRate}
            paidCount={financeData.paymentSummary.paidCount}
            unpaidCount={financeData.paymentSummary.unpaidCount}
          />
        </div>
      </section>
      <DashboardQuickLinkSection />
    </div>
  );
}

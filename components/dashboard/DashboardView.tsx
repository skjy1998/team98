"use client";

import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import PageHeader from "../PageHeader";
import DashboardNoticeSection from "./DashboardNoticeSection";
import DashboardUpcomingMatchSection from "./DashboardUpcomingMatchSection";
import DashboardRecentMatchBar from "./DashboardRecentMatchBar";
import DashboardSeasonSummarySection from "./DashboardSeasonSummarySection";
import DashboardTopRecordSection from "./DashboardTopRecordSection";
import DashboardTodoSection from "./DashboardTodoSection";
import DashboardMyRecordSection from "./DashboardMyRecordSection";
import DashboardFinanceSummarySection from "./DashboardFinanceSummarySection";
import DashboardQuickLinkSection from "./DashboardQuickLinkSection";

export type DashboardViewData = Omit<
  ReturnType<typeof useDashboardData>,
  "isLoaded"
>;

interface DashboardViewProps {
  data: DashboardViewData;
}

export default function DashboardView({ data }: Readonly<DashboardViewProps>) {
  const { todoData, matchData, statsData, financeData, boardData } = data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="대시보드"
        description="오늘 팀 상태와 주요 지표를 한눈에 확인하세요."
      />

      <DashboardNoticeSection notices={boardData.recentNotice} />

      <section className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.95fr)]">
        <div className="min-w-0 space-y-4 sm:space-y-6">
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

          <DashboardTopRecordSection
            topAppearance={statsData.topAppearance}
            topScorer={statsData.topScorer}
            topAssister={statsData.topAssister}
          />
        </div>

        <div className="min-w-0 space-y-4 sm:space-y-6">
          <DashboardTodoSection items={todoData.items} />
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

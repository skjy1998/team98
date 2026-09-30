"use client";
import PageHeader from "@/components/PageHeader";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import ContentState from "../common/ContentState";
import DashboardView from "./DashboardView";

export default function DashboardPageClient() {
  const pageData = useDashboardData();
  const { isLoaded } = pageData;

  if (!isLoaded) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="대시보드"
          description="오늘 팀 상태와 주요 지표를 한눈에 확인하세요."
        />

        <ContentState
          variant="loading"
          title="대시보드 데이터를 불러오는 중..."
          description="팀 현황과 최신 기록을 준비하고 있어요."
        />
      </div>
    );
  }

  return <DashboardView data={pageData} />;
}

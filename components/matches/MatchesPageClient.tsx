"use client";
import PageHeader from "@/components/PageHeader";
import ContentState from "../common/ContentState";
import { useMatchesPageData } from "@/hooks/matches/useMatchesPageData";
import MatchesPageContent from "./list/MatchesPageContent";

export default function MatchesPageClient() {
  const pageData = useMatchesPageData();

  const { isLoaded, pageError, onRetry } = pageData;

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />
        <ContentState
          variant="loading"
          title="경기 일정을 불러오는 중..."
          description="등록된 경기와 투표 정보를 준비하고 있어요."
        />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />

        <ContentState
          variant="error"
          title="경기 일정을 불러오지 못했어요."
          description={pageError}
          action={
            <button
              type="button"
              onClick={() => void onRetry()}
              className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              다시 시도
            </button>
          }
        />
      </div>
    );
  }

  return <MatchesPageContent data={pageData} />;
}

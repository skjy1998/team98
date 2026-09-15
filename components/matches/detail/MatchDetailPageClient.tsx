"use client";
import MatchDetailHeader from "@/components/matches/detail/MatchDetailHeader";
import MatchDetailTabs from "@/components/matches/detail/MatchDetailTabs";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import ContentState from "@/components/common/ContentState";
import { useMatchDetailPageData } from "@/hooks/matches/useMatchDetailPageData";
import { useMatchDetailActions } from "@/hooks/matches/useMatchDetailActions";
import MatchDetailTabContent from "./MatchDetailTabContent";

interface MatchDetailPageClientProps {
  matchId: string;
}

export default function MatchDetailPageClient({
  matchId,
}: Readonly<MatchDetailPageClientProps>) {
  const pageData = useMatchDetailPageData(matchId);

  const {
    team,
    isLoaded,
    pageError,
    reloadPageData,
    match,
    resolvedMatch,
    updateMatch,
    updateMatchPlayersPerSide,
    updateMatchRecordInclusion,
    setMatchRecordCompletion,
    deleteMatch: removeMatch,
  } = pageData;

  const detailActions = useMatchDetailActions({
    match,
    updateMatch,
    updateMatchPlayersPerSide,
    updateMatchRecordInclusion,
    setMatchRecordCompletion,
    deleteMatch: removeMatch,
  });

  const { activeTab, handleChangeTab } = detailActions;

  if (!isLoaded) {
    return (
      <ContentState
        variant="loading"
        title="경기 정보를 불러오는 중..."
        description="경기 일정과 상세 기록을 준비하고 있어요."
      />
    );
  }

  if (pageError) {
    return (
      <ContentState
        variant="error"
        title="경기 정보를 불러오지 못했어요."
        description={pageError}
        action={
          <button
            type="button"
            onClick={() => void reloadPageData()}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            다시 시도
          </button>
        }
      />
    );
  }

  if (!match) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-stone-900">
          경기 정보를 찾을 수 없어요.
        </p>
        <Link
          href="/matches"
          className="mt-4 inline-flex text-sm font-medium text-emerald-700"
        >
          일정 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!resolvedMatch) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/matches"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-800"
      >
        <ChevronLeft className="h-4 w-4" />
        일정 목록
      </Link>

      <MatchDetailHeader
        match={resolvedMatch}
        teamName={team?.name ?? "우리 팀"}
      />

      <MatchDetailTabs activeTab={activeTab} onChange={handleChangeTab} />
      <MatchDetailTabContent
        match={resolvedMatch}
        data={pageData}
        actions={detailActions}
      />
    </div>
  );
}

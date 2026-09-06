"use client";

import PageHeader from "@/components/PageHeader";
import ContentState from "../common/ContentState";
import { useTacticsPageData } from "@/hooks/tactics/useTacticsPageData";
import TacticsBoardContent from "./board/TacticsBoardContent";

export default function TacticsPageClient() {
  const pageData = useTacticsPageData();

  const { canManage, isLoaded, pageError, reloadPageData } = pageData;

  if (!isLoaded) {
    return (
      <ContentState
        variant="loading"
        title="전술 정보를 불러오는 중..."
        description="포메이션과 선수 배치를 준비하고 있어요."
      />
    );
  }

  if (pageError) {
    return (
      <ContentState
        variant="error"
        title="전술 정보를 불러오지 못했어요."
        description={pageError}
        action={
          <button
            type="button"
            onClick={() => void reloadPageData()}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            다시 시도
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="전술 보드"
        description={
          canManage
            ? "포지션을 선택하고 오른쪽 선수 목록에서 배치해 보세요."
            : "팀 전술 배치를 확인할 수 있어요."
        }
      />

      <TacticsBoardContent data={pageData} />
    </div>
  );
}

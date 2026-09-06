"use client";

import PageHeader from "@/components/PageHeader";
import { usePlayersPageState } from "@/hooks/players/usePlayersPageState";
import { usePlayersPageActions } from "@/hooks/players/usePlayersPageActions";
import ContentState from "../common/ContentState";
import { usePlayersPageData } from "@/hooks/players/usePlayersPageData";
import PlayersPageContent from "./PlayersPageContent";

export default function PlayersPageClient() {
  const pageState = usePlayersPageState();

  const pageData = usePlayersPageData({
    search: pageState.search,
    sortType: pageState.sortType,
    editingPlayer: pageState.editingPlayer,
  });

  const pageActions = usePlayersPageActions({
    teamId: pageData.teamId,
    players: pageData.players,
    addPlayer: pageData.addPlayer,
    deletePlayer: pageData.deletePlayer,
    reloadPlayers: pageData.reloadPlayers,
    handleCloseCreate: pageState.handleCloseCreate,
    handleCloseEdit: pageState.handleCloseEdit,
  });

  const { isLoaded, pageError, reloadPageData } = pageData;

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="선수 관리"
          description="등록된 선수 목록을 확인하고 관리하세요."
        />
        <ContentState
          variant="loading"
          title="선수 정보를 불러오는 중..."
          description="선수 명단과 경기 기록을 준비하고 있어요."
        />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="선수 관리"
          description="등록된 선수 목록을 확인하고 관리하세요."
        />
        <ContentState
          variant="error"
          title="선수 정보를 불러오지 못했어요."
          description={pageError}
          action={
            <button
              type="button"
              onClick={reloadPageData}
              className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              다시 시도
            </button>
          }
        />
      </div>
    );
  }

  return (
    <PlayersPageContent
      state={pageState}
      data={pageData}
      actions={pageActions}
    />
  );
}

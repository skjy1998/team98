"use client";

import PageHeader from "@/components/PageHeader";
import PlayerCreateModal from "@/components/players/modal/PlayerCreateModal";
import PlayerEditModal from "@/components/players/modal/edit/PlayerEditModal";
import PlayerTable from "@/components/players/list/PlayerTable";
import PlayerToolbar from "@/components/players/list/PlayerToolbar";
import { usePlayersPageState } from "@/hooks/players/usePlayersPageState";
import { usePlayersPageActions } from "@/hooks/players/usePlayersPageActions";
import ContentState from "../common/ContentState";
import { usePlayersPageData } from "@/hooks/players/usePlayersPageData";

export default function PlayersPageClient() {
  const {
    search,
    setSearch,
    sortType,
    setSortType,
    isCreateOpen,
    editingPlayer,
    handleOpenCreate,
    handleCloseCreate,
    handleEdit,
    handleCloseEdit,
  } = usePlayersPageState();

  const {
    teamId,
    players,
    filteredPlayers,
    availableMembers,
    canManage,
    isLoaded,
    pageError,
    addPlayer,
    deletePlayer,
    reloadPlayers,
    reloadPageData,
  } = usePlayersPageData({
    search,
    sortType,
    editingPlayer,
  });

  const { handleCreatePlayer, handleEditPlayer, handleDeletePlayer } =
    usePlayersPageActions({
      teamId,
      players,
      addPlayer,
      deletePlayer,
      reloadPlayers,
      handleCloseCreate,
      handleCloseEdit,
    });

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
    <div className="space-y-6">
      <PageHeader
        title="선수 관리"
        description="등록된 선수 목록을 확인하고 관리하세요."
      />
      {!canManage && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          현재 계정은 읽기 전용이에요. 회장 또는 운영진만 선수 정보를 추가하거나
          수정할 수 있어요.
        </div>
      )}
      <PlayerToolbar
        search={search}
        totalCount={filteredPlayers.length}
        sortType={sortType}
        onSearchChange={setSearch}
        onChangeSortType={setSortType}
        onOpen={canManage ? handleOpenCreate : undefined}
      />
      {canManage && isCreateOpen && (
        <PlayerCreateModal
          onClose={handleCloseCreate}
          onSave={handleCreatePlayer}
        />
      )}
      <PlayerTable
        players={filteredPlayers}
        onEdit={canManage ? handleEdit : undefined}
        onDelete={canManage ? handleDeletePlayer : undefined}
      />

      {canManage && editingPlayer && (
        <PlayerEditModal
          key={editingPlayer.id}
          player={editingPlayer}
          connectableMembers={availableMembers}
          onClose={handleCloseEdit}
          onSave={handleEditPlayer}
        />
      )}
    </div>
  );
}

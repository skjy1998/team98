"use client";

import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import PlayerCreateModal from "@/components/players/PlayerCreateModal";
import PlayerDeleteModal from "@/components/players/PlayerDeleteModal";
import PlayerEditModal from "@/components/players/PlayerEdit/PlayerEditModal";
import PlayerTable from "@/components/players/PlayerTable";
import PlayerToolbar from "@/components/players/PlayerToolbar";
import { useMatches } from "@/hooks/useMatches";
import { getDisplayPlayers, getFilteredPlayers } from "@/lib/player-stats";
import { useMatchVotes } from "@/hooks/useMatchVotes";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";
import { usePlayersPageState } from "@/hooks/players/usePlayersPageState";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";
import { useConnectableTeamMembers } from "@/hooks/players/useConnectableTeamMembers";
import { usePlayersPageActions } from "@/hooks/players/usePlayersPageActions";
import { usePlayers } from "@/hooks/players/usePlayers";

export default function PlayersPageClient() {
  const {
    players,
    playersLoaded,
    addPlayer,
    updatePlayer,
    deletePlayer,
    reloadPlayers,
  } = usePlayers();
  const { matches } = useMatches();
  const { votes } = useMatchVotes();
  const { records } = useMatchRecordsMap();
  const { canManage, memberLoaded } = useCurrentTeamMember();
  const { team } = useCurrentTeam();
  const {
    search,
    setSearch,
    sortType,
    setSortType,
    isCreateOpen,
    editingPlayer,
    deletingPlayer,
    handleOpenCreate,
    handleCloseCreate,
    handleEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,
  } = usePlayersPageState();

  const { availableMembers } = useConnectableTeamMembers({
    teamId: team?.id,
    players,
    editingPlayer,
  });

  const { handleCreatePlayer, handleEditPlayer, handleDeletePlayer } =
    usePlayersPageActions({
      teamId: team?.id,
      players,
      addPlayer,
      updatePlayer,
      deletePlayer,
      reloadPlayers,
      deletingPlayer,
      handleCloseCreate,
      handleCloseEdit,
      handleCloseDelete,
    });

  // 원본 선수, 경기, 출석, 기록 데이터 합쳐서 표에 보여줄 선수 목록을 만드는 단계
  const displayPlayers = useMemo(
    () => getDisplayPlayers(players, matches, votes, records),
    [players, matches, votes, records],
  );

  // displayPlayers에 검색과 정렬을 적용한 최종 리스트를 만들기 위해
  const filteredPlayers = useMemo(
    () => getFilteredPlayers(displayPlayers, search, sortType),
    [displayPlayers, search, sortType],
  );

  if (!playersLoaded || !memberLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="선수 관리"
          description="등록된 선수 목록을 확인하고 관리하세요."
        />
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          선수 정보를 불러오는 중...
        </div>
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
        onDelete={canManage ? handleOpenDelete : undefined}
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
      {canManage && deletingPlayer && (
        <PlayerDeleteModal
          player={deletingPlayer}
          onClose={handleCloseDelete}
          onDelete={handleDeletePlayer}
        />
      )}
    </div>
  );
}

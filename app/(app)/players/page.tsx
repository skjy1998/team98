"use client";

import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import PlayerCreateModal from "@/components/players/PlayerCreateModal";
import PlayerDeleteModal from "@/components/players/PlayerDeleteModal";
import PlayerEditModal from "@/components/players/PlayerEdit/PlayerEditModal";
import PlayerTable from "@/components/players/PlayerTable";
import PlayerToolbar from "@/components/players/PlayerToolbar";
import { usePlayers } from "@/hooks/usePlayers";
import { useMatches } from "@/hooks/useMatches";

import { getDisplayPlayers, getFilteredPlayers } from "@/lib/player-stats";

import { useMatchVotes } from "@/hooks/useMatchVotes";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";
import { usePlayersPageState } from "@/hooks/usePlayersPageState";

export default function PlayersPage() {
  // 선수 원본 목록 가져오기, 생성/수정/삭제 후 데이터도 바꾸기 위해 setPlayers
  const { players, setPlayers } = usePlayers();
  // 선수의 출전 수, 골, 도움을 계산할 때 필요한 경기 목록 필요위해
  const { matches } = useMatches();
  // 출전 수 계산 위해
  const { votes } = useMatchVotes();
  // 골/도움 계산위해
  const { records } = useMatchRecordsMap();

  const {
    search,
    setSearch,
    sortType,
    setSortType,
    isCreateOpen,
    editingPlayer,
    deletePlayer,
    handleOpenCreate,
    handleCloseCreate,
    handleEdit,
    handleCloseEdit,
    handleCreate,
    handleEditSave,
    handleOpenDelete,
    handleCloseDelete,
    handleDelete,
  } = usePlayersPageState({ setPlayers });

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="선수 관리"
        description="등록된 선수 목록을 확인하고 관리하세요."
      />

      <PlayerToolbar
        search={search}
        totalCount={filteredPlayers.length}
        sortType={sortType}
        onSearchChange={setSearch}
        onChangeSortType={setSortType}
        onOpen={handleOpenCreate}
      />

      {isCreateOpen && (
        <PlayerCreateModal onClose={handleCloseCreate} onSave={handleCreate} />
      )}

      <PlayerTable
        players={filteredPlayers}
        onEdit={handleEdit}
        onDelete={handleOpenDelete}
      />

      {editingPlayer && (
        <PlayerEditModal
          player={editingPlayer}
          onClose={handleCloseEdit}
          onSave={handleEditSave}
        />
      )}

      {deletePlayer && (
        <PlayerDeleteModal
          player={deletePlayer}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

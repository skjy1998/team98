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
import { PlayerType, TeamMemberRole } from "@/types/player";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";
import { supabase } from "@/lib/supabase";
import { useCurrentTeam } from "@/hooks/useCurrentTeam";

export default function PlayersPage() {
  // 선수 원본 목록 가져오기, 생성/수정/삭제 후 데이터도 바꾸기 위해 setPlayers
  const {
    players,
    playersLoaded,
    addPlayer,
    updatePlayer,
    deletePlayer,
    reloadPlayers,
  } = usePlayers();
  // 선수의 출전 수, 골, 도움을 계산할 때 필요한 경기 목록 필요위해
  const { matches } = useMatches();
  // 출전 수 계산 위해
  const { votes } = useMatchVotes();
  // 골/도움 계산위해
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
    deletePlayer: deletingPlayer,
    handleOpenCreate,
    handleCloseCreate,
    handleEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,
  } = usePlayersPageState();

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

  const handleCreatePlayer = async (player: PlayerType) => {
    const success = await addPlayer(player);
    if (success) {
      handleCloseCreate();
    }
  };

  const handleEditPlayer = async (
    player: PlayerType,
    teamRole: TeamMemberRole,
  ) => {
    if (!team?.id) {
      globalThis.alert("현재 팀 정보를 불러오지 못했어요.");
      return;
    }

    if (!player.userId) {
      globalThis.alert("이 선수와 연결된 계정 정보가 없어요.");
      return;
    }

    const playerSuccess = await updatePlayer({
      ...player,
      teamMemberRole: teamRole,
    });

    if (!playerSuccess) {
      globalThis.alert("선수 정보 저장에 실패했어요.");
      return;
    }

    const { error } = await supabase
      .from("team_members")
      .update({ role: teamRole })
      .eq("team_id", team.id)
      .eq("user_id", player.userId);

    if (error) {
      globalThis.alert(error.message);
      return;
    }

    await reloadPlayers();
    handleCloseEdit();
  };

  const handleDeletePlayer = async () => {
    if (!deletingPlayer) return;

    const success = await deletePlayer(deletingPlayer.id);
    if (success) {
      handleCloseDelete();
    }
  };

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
          현재 계정은 읽기 전용이에요. 팀 회장만 선수 정보를 추가하거나 수정할
          수 있어요.
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

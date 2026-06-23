"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import PlayerCreateModal from "@/components/players/PlayerCreateModal";
import PlayerDeleteModal from "@/components/players/PlayerDeleteModal";
import PlayerEditModal from "@/components/players/PlayerEditModal";
import PlayerTable from "@/components/players/PlayerTable";
import PlayerToolbar from "@/components/players/PlayerToolbar";
import { usePlayers } from "@/hooks/usePlayers";
import type { PlayerSortType, PlayerType } from "@/types/player";
import { useMatches } from "@/hooks/useMatches";

import { getDisplayPlayers, getFilteredPlayers } from "@/lib/player-stats";

import { useMatchVotes } from "@/hooks/useMatchVotes";
import useMatchRecordsMap from "@/hooks/useMatchRecordMap";

export default function PlayersPage() {
  // 선수 원본 목록 가져오기, 생성/수정/삭제 후 데이터도 바꾸기 위해 setPlayers
  const { players, setPlayers } = usePlayers();
  // 선수의 출전 수, 골, 도움을 계산할 때 필요한 경기 목록 필요위해
  const { matches } = useMatches();
  // 출전 수 계산 위해
  const { votes } = useMatchVotes();
  // 골/도움 계산위해
  const { records } = useMatchRecordsMap();
  // 선수 이름 검색창 값
  const [search, setSearch] = useState("");
  // 어떤 기준으로 선수 목록을 정렬할지 저장
  const [sortType, setSortType] = useState<PlayerSortType>("latest");
  // 선수 추가 모달 열림/닫힘 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // 어떤 선수를 수정 중인지 기억
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  // 어떠 선수를 삭제하려는지 기억
  const [deletePlayer, setDeletePlayer] = useState<PlayerType | null>(null);

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

  // 새 선수 추가 버튼 눌렀을 때 실행
  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setIsCreateOpen(true);
  };

  // 생성 함수
  const handleCreate = (player: PlayerType) => {
    setPlayers((prev) => [...prev, player]);
    setIsCreateOpen(false);
  };

  // 수정 함수
  const handleEdit = (player: PlayerType) => {
    setIsCreateOpen(false);
    setEditingPlayer(player);
  };

  // 수정 모달 저장 함수
  const handleEditSave = (updatedPlayer: PlayerType) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player,
      ),
    );
    setEditingPlayer(null);
  };

  // 삭제 함수
  const handleDelete = () => {
    if (!deletePlayer) return;

    setPlayers((prev) =>
      prev.filter((player) => player.id !== deletePlayer.id),
    );
    setDeletePlayer(null);
  };

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
        <PlayerCreateModal
          onClose={() => setIsCreateOpen(false)}
          onSave={handleCreate}
        />
      )}

      <PlayerTable
        players={filteredPlayers}
        onEdit={handleEdit}
        onDelete={(player) => setDeletePlayer(player)}
      />

      {editingPlayer && (
        <PlayerEditModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={handleEditSave}
        />
      )}

      {deletePlayer && (
        <PlayerDeleteModal
          player={deletePlayer}
          onClose={() => setDeletePlayer(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

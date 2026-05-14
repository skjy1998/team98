"use client";

import PageHeader from "@/components/PageHeader";
import PlayerDeleteModal from "@/components/players/PlayerDeleteModal";
import PlayerFormModal from "@/components/players/PlayerFormModal";
import PlayerTable from "@/components/players/PlayerTable";
import PlayerToolbar from "@/components/players/PlayerToolbar";
import { usePlayers } from "@/hooks/usePlayers";
import { Playertype } from "@/types/player";
import { useState } from "react";

export default function PlayersPage() {
  const { players, setPlayers } = usePlayers();

  const [search, setSearch] = useState("");
  const [positions, setPositions] = useState<string[]>([]);

  // 필터 상태 바꾸기
  const togglesPosition = (pos: string) => {
    setPositions(
      (prev) =>
        prev.includes(pos)
          ? prev.filter((p) => p !== pos) // 제거
          : [...prev, pos], // 추가
    );
  };

  const filteredPlayers = players.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchPosition =
      positions.length === 0 || positions.includes(p.position);
    return matchName && matchPosition;
  });

  const [isFormOpen, setIsFormOpen] = useState(false); // 창 열고 닫기
  const [editingPlayer, setEditingPlayer] = useState<Playertype | null>(null);

  // 선수 저장
  const handleSave = (player: Playertype) => {
    if (editingPlayer) {
      // 수정
      setPlayers((prev) =>
        prev.map((p) => (p.id === editingPlayer.id ? player : p)),
      );
    } else {
      setPlayers((prev) => [...prev, player]);
    }
    setEditingPlayer(null);
    setIsFormOpen(false);
  };

  // 수정 모달 열기
  const handleEdit = (player: Playertype) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const [deletePlayer, setDeletePlayer] = useState<Playertype | null>(null);

  // 삭제하기
  const handleDelete = () => {
    if (!deletePlayer) return;

    setPlayers((prev) => prev.filter((p) => p.id !== deletePlayer.id));
    setDeletePlayer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="선수 관리"
          description="등록된 선수 목록을 확인하고 관리하세요."
        />
      </div>
      {/* Search */}
      <PlayerToolbar
        search={search}
        positions={positions}
        onSearchChange={setSearch}
        onTogglePosition={togglesPosition}
        onOpen={() => setIsFormOpen(true)}
      />

      {/* modal */}
      {isFormOpen && (
        <PlayerFormModal
          key={editingPlayer?.id ?? "new-player"}
          player={editingPlayer}
          onClose={() => {
            setEditingPlayer(null);
            setIsFormOpen(false);
          }}
          onSave={handleSave}
        />
      )}
      {/* player list */}
      <PlayerTable
        players={filteredPlayers}
        onEdit={handleEdit}
        onDelete={(player) => setDeletePlayer(player)}
      />
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

"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PlayerCreateModal from "@/components/players/PlayerCreateModal";
import PlayerDeleteModal from "@/components/players/PlayerDeleteModal";
import PlayerEditModal from "@/components/players/PlayerEditModal";
import PlayerTable from "@/components/players/PlayerTable";
import PlayerToolbar from "@/components/players/PlayerToolbar";
import { usePlayers } from "@/hooks/usePlayers";
import type { PlayerType } from "@/types/player";

export default function PlayersPage() {
  const { players, setPlayers } = usePlayers();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  const [deletePlayer, setDeletePlayer] = useState<PlayerType | null>(null);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setIsCreateOpen(true);
  };

  const handleCreate = (player: PlayerType) => {
    setPlayers((prev) => [...prev, player]);
    setIsCreateOpen(false);
  };

  const handleEdit = (player: PlayerType) => {
    setIsCreateOpen(false);
    setEditingPlayer(player);
  };

  const handleEditSave = (updatedPlayer: PlayerType) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === updatedPlayer.id ? updatedPlayer : player,
      ),
    );
    setEditingPlayer(null);
  };

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
        onSearchChange={setSearch}
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

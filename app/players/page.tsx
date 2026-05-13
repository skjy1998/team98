"use client";

import PageHeader from "@/components/PageHeader";
import PlayerDeleteModal from "@/components/players/PlayerDeleteModal";
import PlayerFormModal from "@/components/players/PlayerFormModal";
import PlayerTable from "@/components/players/PlayerTable";
import PlayerToolbar from "@/components/players/PlayerToolbar";
import { usePlayers } from "@/hooks/usePlayers";
import type { Playertype } from "@/types/player";
import { useState } from "react";

export default function PlayersPage() {
  const { players, setPlayers } = usePlayers();
  const [search, setSearch] = useState("");
  const [positions, setPositions] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Playertype | null>(null);
  const [deletePlayer, setDeletePlayer] = useState<Playertype | null>(null);

  const filteredPlayers = players.filter((player) => {
    const matchName = player.name.toLowerCase().includes(search.toLowerCase());
    const matchPosition =
      positions.length === 0 || positions.includes(player.position);

    return matchName && matchPosition;
  });

  const togglePosition = (position: string) => {
    setPositions((prev) =>
      prev.includes(position)
        ? prev.filter((item) => item !== position)
        : [...prev, position],
    );
  };

  const closeForm = () => {
    setEditingPlayer(null);
    setIsFormOpen(false);
  };

  const handleSave = (player: Playertype) => {
    if (editingPlayer) {
      setPlayers((prev) =>
        prev.map((item) => (item.id === editingPlayer.id ? player : item)),
      );
    } else {
      setPlayers((prev) => [...prev, player]);
    }

    closeForm();
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
      <div className="flex justify-between items-center">
        <PageHeader
          title="선수 관리"
          description="등록된 선수 목록을 확인하고 관리하세요."
        />
      </div>

      <PlayerToolbar
        search={search}
        positions={positions}
        onAdd={() => {
          setEditingPlayer(null);
          setIsFormOpen(true);
        }}
        onSearchChange={setSearch}
        onTogglePosition={togglePosition}
      />

      <PlayerTable
        players={filteredPlayers}
        onEdit={(player) => {
          setEditingPlayer(player);
          setIsFormOpen(true);
        }}
        onDelete={setDeletePlayer}
      />

      {isFormOpen && (
        <PlayerFormModal
          key={editingPlayer?.id ?? "new-player"}
          player={editingPlayer}
          onClose={closeForm}
          onSave={handleSave}
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

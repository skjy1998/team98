"use client";

import PageHeader from "@/components/PageHeader";
import { useDemoData } from "@/components/demo/DemoModeProvider";
import PlayerTable from "@/components/players/list/PlayerTable";
import PlayerToolbar from "@/components/players/list/PlayerToolbar";
import PlayerCreateModal from "@/components/players/modal/PlayerCreateModal";
import PlayerProfileModal from "@/components/players/modal/PlayerProfileModal";
import PlayerEditModal from "@/components/players/modal/edit/PlayerEditModal";
import {
  demoFeeTypes,
  demoPlayerRecentMatches,
} from "@/lib/demo/demo-players-data";
import { getFilteredPlayers } from "@/lib/players/player-list";
import type {
  PlayerSortType,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { useState } from "react";

const demoMvpCounts: Record<string, number> = {
  "demo-player-1": 2,
  "demo-player-2": 3,
  "demo-player-3": 1,
};

export default function DemoPlayersPage() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useDemoData();
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState<PlayerSortType>("latest");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState<PlayerType | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);

  const filteredPlayers = getFilteredPlayers(players, search, sortType);

  const handleCreate = async (player: PlayerType) => {
    addPlayer(player);
    setIsCreateOpen(false);
  };

  const handleEdit = async (
    player: PlayerType,
    teamMemberRole: TeamMemberRole,
  ) => {
    updatePlayer(player, teamMemberRole);
    setEditingPlayer(null);
  };

  const handleDelete = (player: PlayerType) => {
    const confirmed = window.confirm(
      `${player.name} 선수를 데모 목록에서 삭제할까요?`,
    );

    if (!confirmed) return;

    deletePlayer(player.id);
    setViewingPlayer(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="선수 관리"
        description="데모 팀의 선수 정보와 시즌 기록을 확인해 보세요."
      />

      <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-5 text-sky-700 sm:px-4 sm:py-3">
        데모에서 추가·수정·삭제한 내용은 이 브라우저에서만 유지되며,
        새로고침하면 초기화됩니다.
      </div>

      <PlayerToolbar
        search={search}
        totalCount={filteredPlayers.length}
        sortType={sortType}
        onSearchChange={setSearch}
        onChangeSortType={setSortType}
        onOpen={() => setIsCreateOpen(true)}
      />

      <PlayerTable
        players={filteredPlayers}
        onView={(player) => setViewingPlayer(player)}
        onEdit={(player) => setEditingPlayer(player)}
        onDelete={handleDelete}
      />

      {isCreateOpen && (
        <PlayerCreateModal
          feeTypes={demoFeeTypes}
          onClose={() => setIsCreateOpen(false)}
          onSave={handleCreate}
        />
      )}

      {viewingPlayer && (
        <PlayerProfileModal
          player={viewingPlayer}
          onClose={() => setViewingPlayer(null)}
          onEdit={(player) => {
            setViewingPlayer(null);
            setEditingPlayer(player);
          }}
          mvpCount={demoMvpCounts[viewingPlayer.id] ?? 0}
          recentMatches={demoPlayerRecentMatches[viewingPlayer.id] ?? []}
        />
      )}

      {editingPlayer && (
        <PlayerEditModal
          key={editingPlayer.id}
          player={editingPlayer}
          feeTypes={demoFeeTypes}
          connectableMembers={[]}
          onClose={() => setEditingPlayer(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}

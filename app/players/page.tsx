"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import PlayerCreateModal from "@/components/players/PlayerCreateModal";
import PlayerDeleteModal from "@/components/players/PlayerDeleteModal";
import PlayerEditModal from "@/components/players/PlayerEditModal";
import PlayerTable from "@/components/players/PlayerTable";
import PlayerToolbar from "@/components/players/PlayerToolbar";
import { usePlayers } from "@/hooks/usePlayers";
import type { PlayerType } from "@/types/player";
import { getMainPositionFromDetail } from "@/lib/player-ui";
import { useMatches } from "@/hooks/useMatches";
import { MatchVotesByMatchId } from "@/types/match-vote";
import {
  getPastMatchIds,
  getPlayerAppearanceCount,
  getPlayerAssistCount,
  getPlayerGoalCount,
} from "@/lib/player-stats";
import { MatchRecordMap } from "@/types/match";

export default function PlayersPage() {
  const { players, setPlayers } = usePlayers();
  const { matches } = useMatches();
  const [search, setSearch] = useState("");
  const [votes, setVotes] = useState<MatchVotesByMatchId>({});
  const [votesLoaded, setVotesLoaded] = useState(false);
  const [records, setRecords] = useState<MatchRecordMap>({});

  const [sortType, setSortType] = useState<
    "latest" | "number" | "name" | "position"
  >("latest");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  const [deletePlayer, setDeletePlayer] = useState<PlayerType | null>(null);

  useEffect(() => {
    const savedVotes = localStorage.getItem("match-votes");

    if (savedVotes && savedVotes !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVotes(JSON.parse(savedVotes));
      } catch {
        localStorage.removeItem("match-votes");
      }
    }

    setVotesLoaded(true);
  }, []);

  useEffect(() => {
    const savedRecords = localStorage.getItem("match-records");

    if (savedRecords && savedRecords !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords(JSON.parse(savedRecords));
      } catch {
        localStorage.removeItem("match-records");
      }
    }
  }, []);

  const displayPlayers = useMemo(() => {
    const pastMatchIds = getPastMatchIds(matches);
    const matchIds = matches.map((match) => match.id);

    return players.map((player) => ({
      ...player,
      appearance: getPlayerAppearanceCount(player.id, pastMatchIds, votes),
      goal: getPlayerGoalCount(player.id, records, matchIds),
      assist: getPlayerAssistCount(player.id, records, matchIds),
    }));
  }, [players, matches, votes, records]);

  const filteredPlayers = useMemo(() => {
    const searchedPlayers = displayPlayers.filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortType === "name") {
      return [...searchedPlayers].sort((a, b) =>
        a.name.localeCompare(b.name, "ko"),
      );
    }

    if (sortType === "number") {
      return [...searchedPlayers].sort((a, b) => {
        const aNumber = a.number ?? Number.MAX_SAFE_INTEGER;
        const bNumber = b.number ?? Number.MAX_SAFE_INTEGER;
        return aNumber - bNumber;
      });
    }

    if (sortType === "position") {
      const positionOrder = {
        GK: 0,
        DF: 1,
        MF: 2,
        FW: 3,
      } as const;

      return [...searchedPlayers].sort((a, b) => {
        const aPosition =
          getMainPositionFromDetail(a.detailPositions) || a.position || "ZZZ";
        const bPosition =
          getMainPositionFromDetail(b.detailPositions) || b.position || "ZZZ";

        const aRank =
          aPosition in positionOrder
            ? positionOrder[aPosition as keyof typeof positionOrder]
            : 99;
        const bRank =
          bPosition in positionOrder
            ? positionOrder[bPosition as keyof typeof positionOrder]
            : 99;

        if (aRank !== bRank) {
          return aRank - bRank;
        }
        return a.name.localeCompare(b.name, "ko");
      });
    }

    return [...searchedPlayers].reverse();
  }, [displayPlayers, search, sortType]);

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

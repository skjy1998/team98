"use client";

import type { PlayerType } from "@/types/player";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import {
  createTeamPlayer,
  deleteTeamPlayer,
  getTeamPlayers,
} from "@/lib/players/player-repository";

export function usePlayers() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [playersLoaded, setPlayersLoaded] = useState(false);
  const [playersError, setPlayersError] = useState("");

  const loadPlayers = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setPlayers([]);
      setPlayersLoaded(true);
      setPlayersError("");
      return;
    }

    setPlayersLoaded(false);
    setPlayersError("");

    try {
      const nextPlayers = await getTeamPlayers(teamId);
      setPlayers(nextPlayers);
    } catch (error) {
      console.error("players load error", error);
      setPlayers([]);
      setPlayersError("선수 정보를 불러오지 못했어요.");
    } finally {
      setPlayersLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPlayers();
  }, [loadPlayers]);

  const addPlayer = async (player: PlayerType) => {
    if (!teamId) return false;

    try {
      const createdPlayer = await createTeamPlayer(teamId, player);

      setPlayers((current) => [...current, createdPlayer]);
      return true;
    } catch (error) {
      console.error("player create error", error);
      return false;
    }
  };

  const deletePlayer = async (playerId: string) => {
    if (!teamId) return false;

    try {
      await deleteTeamPlayer(teamId, playerId);

      setPlayers((current) =>
        current.filter((player) => player.id !== playerId),
      );

      return true;
    } catch (error) {
      console.error("player delete error", error);
      return false;
    }
  };

  return {
    players,
    playersLoaded,
    playersError,
    addPlayer,
    deletePlayer,
    reloadPlayers: loadPlayers,
  };
}

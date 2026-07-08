"use client";

import { supabase } from "@/lib/supabase";
import { getMainPositionFromDetail } from "@/lib/player-ui";
import type {
  PlayerDetailPosition,
  PlayerRole,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../useCurrentTeam";

type PlayerRow = {
  id: string;
  user_id: string | null;
  name: string;
  position: string | null;
  detail_positions: string[] | null;
  number: number | null;
  birth: string | null;
  role: string | null;
  preferred_foot: string | null;
  note: string | null;
};

function mapPlayerRow(
  player: PlayerRow,
  teamMemberRole?: TeamMemberRole,
): PlayerType {
  return {
    id: player.id,
    userId: player.user_id ?? undefined,
    teamMemberRole,
    name: player.name,
    position: player.position ?? undefined,
    detailPositions:
      (player.detail_positions as PlayerDetailPosition[] | null) ?? undefined,
    number: player.number ?? undefined,
    birth: player.birth ?? undefined,
    role: (player.role as PlayerRole | null) ?? "member",
    preferredFoot:
      (player.preferred_foot as PlayerType["preferredFoot"] | null) ?? "right",
    note: player.note ?? undefined,
    appearance: 0,
    goal: 0,
    assist: 0,
  };
}

export function usePlayers() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [playersLoaded, setPlayersLoaded] = useState(false);

  const loadPlayers = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setPlayers([]);
      setPlayersLoaded(true);
      return;
    }

    setPlayersLoaded(false);

    const { data, error } = await supabase
      .from("players")
      .select(
        "id, user_id, name, position, detail_positions, number, birth, role, preferred_foot, note",
      )
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });

    if (error || !data) {
      setPlayers([]);
      setPlayersLoaded(true);
      return;
    }

    const { data: teamMembers, error: teamMembersError } = await supabase
      .from("team_members")
      .select("user_id, role")
      .eq("team_id", teamId);

    if (teamMembersError) {
      setPlayers(data.map((player) => mapPlayerRow(player)));
      setPlayersLoaded(true);
      return;
    }

    const teamMemberRoleMap = new Map(
      (teamMembers ?? []).map((member) => [
        member.user_id,
        member.role as TeamMemberRole,
      ]),
    );

    setPlayers(
      data.map((player) =>
        mapPlayerRow(
          player,
          player.user_id ? teamMemberRoleMap.get(player.user_id) : undefined,
        ),
      ),
    );

    setPlayersLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPlayers();
  }, [loadPlayers]);

  const addPlayer = async (player: PlayerType) => {
    if (!teamId) return false;

    const { data, error } = await supabase
      .from("players")
      .insert({
        team_id: teamId,
        user_id: player.userId ?? null,
        name: player.name,
        position: getMainPositionFromDetail(player.detailPositions) ?? null,
        detail_positions: player.detailPositions ?? null,
        number: player.number ?? null,
        birth: player.birth ?? null,
        role: player.role ?? "member",
        preferred_foot: player.preferredFoot ?? "right",
        note: player.note ?? null,
      })
      .select(
        "id, user_id, name, position, detail_positions, number, birth, role, preferred_foot, note",
      )
      .single();

    if (error || !data) {
      return false;
    }

    setPlayers((prev) => [...prev, mapPlayerRow(data, player.teamMemberRole)]);
    return true;
  };

  const updatePlayer = async (updatedPlayer: PlayerType) => {
    const { data, error } = await supabase
      .from("players")
      .update({
        user_id: updatedPlayer.userId ?? null,
        name: updatedPlayer.name,
        position:
          getMainPositionFromDetail(updatedPlayer.detailPositions) ?? null,
        detail_positions: updatedPlayer.detailPositions ?? null,
        number: updatedPlayer.number ?? null,
        birth: updatedPlayer.birth ?? null,
        role: updatedPlayer.role ?? "member",
        preferred_foot: updatedPlayer.preferredFoot ?? "right",
        note: updatedPlayer.note ?? null,
      })
      .eq("id", updatedPlayer.id)
      .select(
        "id, user_id, name, position, detail_positions, number, birth, role, preferred_foot, note",
      )
      .single();

    if (error || !data) {
      return false;
    }

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === updatedPlayer.id
          ? mapPlayerRow(data, updatedPlayer.teamMemberRole)
          : player,
      ),
    );

    return true;
  };

  const deletePlayer = async (playerId: string) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId);

    if (error) {
      console.error("players delete error", error);
      globalThis.alert(error.message);
      return false;
    }

    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    return true;
  };

  return {
    players,
    playersLoaded,
    addPlayer,
    updatePlayer,
    deletePlayer,
    reloadPlayers: loadPlayers,
  };
}

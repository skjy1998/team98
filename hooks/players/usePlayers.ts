"use client";

import { supabase } from "@/lib/supabase";
import { getMainPositionFromDetail } from "@/lib/players/player-ui";
import type {
  PlayerDetailPosition,
  PlayerPosition,
  PlayerPreferredFoot,
  PlayerRole,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";

type PlayerRow = {
  id: string;
  user_id: string | null;
  name: string;
  position: PlayerPosition | null;
  detail_positions: PlayerDetailPosition[] | null;
  number: number | null;
  birth: string | null;
  role: PlayerRole | null;
  preferred_foot: PlayerPreferredFoot | null;
  note: string | null;
};

type TeamMemberRoleRow = {
  user_id: string;
  role: TeamMemberRole;
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
    detailPositions: player.detail_positions ?? undefined,
    number: player.number ?? undefined,
    birth: player.birth ?? undefined,
    role: player.role ?? "member",
    preferredFoot: player.preferred_foot ?? "right",
    note: player.note ?? undefined,
    appearance: 0,
    goal: 0,
    assist: 0,
  };
}

function mergePlayersWithTeamMemberRoles(
  players: PlayerRow[],
  teamMembers: TeamMemberRoleRow[],
) {
  const teamMemberRoleMap = new Map(
    teamMembers.map((member) => [member.user_id, member.role]),
  );

  return players.map((player) =>
    mapPlayerRow(
      player,
      player.user_id ? teamMemberRoleMap.get(player.user_id) : undefined,
    ),
  );
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

    const { data: playerRows, error: playersError } = await supabase
      .from("players")
      .select(
        "id, user_id, name, position, detail_positions, number, birth, role, preferred_foot, note",
      )
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });

    if (playersError || !playerRows) {
      setPlayers([]);
      setPlayersLoaded(true);
      return;
    }

    const { data: teamMemberRows, error: teamMembersError } = await supabase
      .from("team_members")
      .select("user_id, role")
      .eq("team_id", teamId);

    if (teamMembersError || !teamMemberRows) {
      setPlayers(playerRows.map((player) => mapPlayerRow(player)));
      setPlayersLoaded(true);
      return;
    }

    setPlayers(
      mergePlayersWithTeamMemberRoles(
        playerRows,
        teamMemberRows as TeamMemberRoleRow[],
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

  const deletePlayer = async (playerId: string) => {
    if (!teamId) return false;

    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId)
      .eq("team_id", teamId);

    if (error) {
      console.error("players delete error", error);
      return false;
    }

    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    return true;
  };

  return {
    players,
    playersLoaded,
    addPlayer,
    deletePlayer,
    reloadPlayers: loadPlayers,
  };
}

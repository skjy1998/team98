// Supabase 데이터 접근

import type {
  ConnectableTeamMember,
  PlayerDetailPosition,
  PlayerPosition,
  PlayerPreferredFoot,
  PlayerRole,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { supabase } from "../supabase";
import { getMainPositionFromDetail } from "./player-ui";

interface PlayerRow {
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
}

interface TeamMemberRow {
  user_id: string;
  role: TeamMemberRole;
  display_name?: string | null;
}

const PLAYER_COLUMNS = `
  id,
  user_id,
  name,
  position,
  detail_positions,
  number,
  birth,
  role,
  preferred_foot,
  note
`;

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

export async function getTeamPlayers(teamId: string) {
  const { data: playerRows, error: playersError } = await supabase
    .from("players")
    .select(PLAYER_COLUMNS)
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });

  if (playersError) {
    throw playersError;
  }

  const { data: teamMemberRows, error: teamMembersError } = await supabase
    .from("team_members")
    .select("user_id, role")
    .eq("team_id", teamId);

  if (teamMembersError) {
    throw teamMembersError;
  }

  const roleMap = new Map(
    (teamMemberRows as TeamMemberRow[]).map((member) => [
      member.user_id,
      member.role,
    ]),
  );

  return (playerRows as PlayerRow[]).map((player) =>
    mapPlayerRow(
      player,
      player.user_id ? roleMap.get(player.user_id) : undefined,
    ),
  );
}

export async function createTeamPlayer(teamId: string, player: PlayerType) {
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
    .select(PLAYER_COLUMNS)
    .single();

  if (error) {
    throw error;
  }
  return mapPlayerRow(data as PlayerRow, player.teamMemberRole);
}

export async function deleteTeamPlayer(teamId: string, playerId: string) {
  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", playerId)
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }
}

export async function getConnectableTeamMembers(
  teamId: string,
): Promise<ConnectableTeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("user_id, role, display_name")
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }

  return (data as TeamMemberRow[]).map((member) => ({
    userId: member.user_id,
    role: member.role,
    label: member.display_name || member.user_id,
  }));
}

export async function updateTeamPlayerWithRoles(
  teamId: string,
  player: PlayerType,
  teamRole: TeamMemberRole,
) {
  const { error } = await supabase.rpc("update_player_with_roles", {
    p_team_id: teamId,
    p_player_id: player.id,
    p_user_id: player.userId ?? null,
    p_name: player.name,
    p_preferred_foot: player.preferredFoot ?? "right",
    p_player_role: player.role ?? "member",
    p_position: getMainPositionFromDetail(player.detailPositions) ?? null,
    p_detail_positions: player.detailPositions ?? null,
    p_number: player.number ?? null,
    p_birth: player.birth ?? null,
    p_note: player.note ?? null,
    p_team_role: teamRole,
  });

  if (error) {
    throw error;
  }
}

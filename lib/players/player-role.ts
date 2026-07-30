import { getMainPositionFromDetail } from "@/lib/players/player-ui";
import { supabase } from "@/lib/supabase";
import type { PlayerType, TeamMemberRole } from "@/types/player";

export function findCurrentOwner(players: PlayerType[], playerId: string) {
  return players.find(
    (player) => player.id !== playerId && player.teamMemberRole === "owner",
  );
}

export function findCurrentCaptain(players: PlayerType[], playerId: string) {
  return players.find(
    (player) => player.id !== playerId && player.role === "captain",
  );
}

export async function updatePlayerWithRoles(
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
    const errorMessage = [
      error.message,
      error.details,
      error.hint,
      error.code ? `code: ${error.code}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    console.error("update player with roles error", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    globalThis.alert(errorMessage || "선수 정보 저장에 실패했어요.");
    return false;
  }

  return true;
}

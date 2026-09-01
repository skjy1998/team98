import type { PlayerDetailPosition } from "@/types/player";
import type { ProfileSettingsData } from "@/types/settings";
import { supabase } from "../supabase";
import { getMainPositionFromDetail } from "../players/player-ui";

interface ProfilePlayerRow {
  id: string;
  name: string;
  number: number | null;
  detail_positions: PlayerDetailPosition[] | null;
}

export async function getProfileSettings(
  teamId?: string,
): Promise<ProfileSettingsData> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("authenticated user not found");

  let player: ProfileSettingsData["player"] = null;

  if (teamId) {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, number, detail_positions")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const row = data as ProfilePlayerRow;

      player = {
        id: row.id,
        name: row.name,
        number: row.number ?? undefined,
        detailPositions: row.detail_positions ?? [],
      };
    }
  }

  const metadataName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name.trim()
      : "";

  return {
    userId: user.id,
    name: metadataName || player?.name || user.email?.split("@")[0] || "사용자",
    email: user.email ?? "",
    player,
  };
}

export async function updateCurrentProfileName(name: string) {
  const { error } = await supabase.rpc("update_my_profile_name", {
    p_name: name,
  });

  if (error) throw error;
}

export async function updateCurrentProfileEmail(email: string) {
  const { error } = await supabase.auth.updateUser({ email });

  if (error) throw error;
}

export async function updateCurrentPlayerSettings(
  teamId: string,
  playerId: string,
  number: number | undefined,
  detailPositions: PlayerDetailPosition[],
) {
  const { error } = await supabase.rpc("update_my_player_settings", {
    p_team_id: teamId,
    p_player_id: playerId,
    p_number: number ?? null,
    p_position: getMainPositionFromDetail(detailPositions) ?? null,
    p_detail_positions: detailPositions.length > 0 ? detailPositions : null,
  });

  if (error) throw error;
}

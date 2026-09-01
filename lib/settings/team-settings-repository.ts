import type { TeamSettingsSummary, TeamSport } from "@/types/team";
import { supabase } from "../supabase";

export async function getTeamSettingsSummary(
  teamId: string,
): Promise<TeamSettingsSummary> {
  const [playersResult, accountsResult, unlinkedPlayersResult] =
    await Promise.all([
      supabase
        .from("players")
        .select("id", { count: "exact", head: true })
        .eq("team_id", teamId),

      supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .eq("team_id", teamId),

      supabase
        .from("players")
        .select("id", { count: "exact", head: true })
        .eq("team_id", teamId)
        .is("user_id", null),
    ]);

  const error =
    playersResult.error || accountsResult.error || unlinkedPlayersResult.error;

  if (error) throw error;

  return {
    playerCount: playersResult.count ?? 0,
    accountCount: accountsResult.count ?? 0,
    unlinkedPlayerCount: unlinkedPlayersResult.count ?? 0,
  };
}

export async function updateTeamSettingsProfile(
  teamId: string,
  name: string,
  sport: TeamSport,
) {
  const { error } = await supabase.rpc("update_team_profile", {
    p_team_id: teamId,
    p_name: name,
    p_sport: sport,
  });

  if (error) throw error;
}

export async function regenerateTeamInviteCode(teamId: string) {
  const { error } = await supabase.rpc("regenerate_team_invite_code", {
    p_team_id: teamId,
  });

  if (error) throw error;
}

export async function leaveCurrentTeam(teamId: string) {
  const { error } = await supabase.rpc("leave_current_team", {
    p_team_id: teamId,
  });

  if (error) throw error;
}

export async function deleteCurrentTeam(teamId: string, teamName: string) {
  const { error } = await supabase.rpc("delete_current_team", {
    p_team_id: teamId,
    p_team_name: teamName,
  });

  if (error) throw error;
}

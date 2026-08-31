import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import { supabase } from "../supabase";

interface TeamSeasonRow {
  id: string;
  team_id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SEASON_COLUMNS = `
  id,
  team_id,
  name,
  start_date,
  end_date,
  is_active,
  created_at,
  updated_at
`;

function mapSeason(row: TeamSeasonRow): TeamSeason {
  return {
    id: row.id,
    teamId: row.team_id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getTeamSeasons(teamId: string) {
  const { data, error } = await supabase
    .from("team_seasons")
    .select(SEASON_COLUMNS)
    .eq("team_id", teamId)
    .order("is_active", { ascending: false })
    .order("start_date", { ascending: false });

  if (error) throw error;

  return (data as TeamSeasonRow[]).map(mapSeason);
}

export async function createTeamSeason(
  teamId: string,
  currentUserId: string,
  value: TeamSeasonFormValue,
) {
  const { error } = await supabase.from("team_seasons").insert({
    team_id: teamId,
    name: value.name.trim(),
    start_date: value.startDate,
    end_date: value.endDate || null,
    is_active: false,
    created_by: currentUserId,
  });

  if (error) throw error;
}

export async function updateTeamSeason(
  teamId: string,
  seasonId: string,
  value: TeamSeasonFormValue,
) {
  const { error } = await supabase
    .from("team_seasons")
    .update({
      name: value.name.trim(),
      start_date: value.startDate,
      end_date: value.endDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", seasonId)
    .eq("team_id", teamId);

  if (error) throw error;
}

export async function activateTeamSeason(teamId: string, seasonId: string) {
  const { error } = await supabase.rpc("set_active_team_season", {
    target_team_id: teamId,
    target_season_id: seasonId,
  });

  if (error) throw error;
}

export async function deleteTeamSeason(teamId: string, seasonId: string) {
  const { error } = await supabase
    .from("team_seasons")
    .delete()
    .eq("id", seasonId)
    .eq("team_id", teamId);

  if (error) throw error;
}

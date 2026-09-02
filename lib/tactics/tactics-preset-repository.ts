import type {
  FormationName,
  FormationSlot,
  SavedFormation,
  SaveTacticPreset,
} from "@/types/tactics";
import { supabase } from "../supabase";

interface TacticsPresetRow {
  id: string;
  name: string;
  formation: FormationName;
  slots: FormationSlot[];
  corner_kick_player_id: string | null;
  free_kick_player_id: string | null;
  penalty_kick_player_id: string | null;
  updated_at: string;
}

interface TacticsPresetValue extends SavedFormation {
  name: string;
}

const TACTICS_PRESET_COLUMNS = `
  id,
  name,
  formation,
  slots,
  corner_kick_player_id,
  free_kick_player_id,
  penalty_kick_player_id,
  updated_at
`;

function mapTacticsPreset(row: TacticsPresetRow): SaveTacticPreset {
  return {
    id: row.id,
    name: row.name,
    formation: row.formation,
    slots: row.slots,
    cornerKickPlayerId: row.corner_kick_player_id ?? "",
    freeKickPlayerId: row.free_kick_player_id ?? "",
    penaltyKickPlayerId: row.penalty_kick_player_id ?? "",
    saveAt: row.updated_at,
  };
}

function getPresetDatabaseValue(value: TacticsPresetValue) {
  return {
    name: value.name.trim(),
    formation: value.formation,
    slots: value.slots,
    corner_kick_player_id: value.cornerKickPlayerId || null,
    free_kick_player_id: value.freeKickPlayerId || null,
    penalty_kick_player_id: value.penaltyKickPlayerId || null,
    updated_at: new Date().toISOString(),
  };
}

export async function getTeamTacticsPresets(teamId: string) {
  const { data, error } = await supabase
    .from("team_tactics_presets")
    .select(TACTICS_PRESET_COLUMNS)
    .eq("team_id", teamId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data as TacticsPresetRow[]).map(mapTacticsPreset);
}

export async function createTeamTacticsPreset(
  teamId: string,
  value: TacticsPresetValue,
) {
  const { data, error } = await supabase
    .from("team_tactics_presets")
    .insert({
      team_id: teamId,
      ...getPresetDatabaseValue(value),
    })
    .select(TACTICS_PRESET_COLUMNS)
    .single();

  if (error) throw error;

  return mapTacticsPreset(data as TacticsPresetRow);
}

export async function updateTeamTacticsPreset(
  teamId: string,
  presetId: string,
  value: TacticsPresetValue,
) {
  const { data, error } = await supabase
    .from("team_tactics_presets")
    .update(getPresetDatabaseValue(value))
    .eq("id", presetId)
    .eq("team_id", teamId)
    .select(TACTICS_PRESET_COLUMNS)
    .single();

  if (error) throw error;

  return mapTacticsPreset(data as TacticsPresetRow);
}

export async function deleteTeamTacticsPreset(
  teamId: string,
  presetId: string,
) {
  const { data, error } = await supabase
    .from("team_tactics_presets")
    .delete()
    .eq("id", presetId)
    .eq("team_id", teamId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  return data !== null;
}

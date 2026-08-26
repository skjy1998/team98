import type { MatchPlayersPerSide } from "@/types/match";
import type {
  FormationName,
  FormationSlot,
  MatchQuarter,
  MatchTacticsByQuarter,
  MatchTacticsBySide,
  MatchTacticsSide,
} from "@/types/tactics";
import {
  createDefaultMatchTacticsBySide,
  getMatchFormationOptions,
} from "../tactics/tactics-ui";
import { createQuarterOptions } from "./match-quarter";
import type { TeamSport } from "@/types/team";
import { supabase } from "../supabase";

interface MatchTacticsRow {
  quarter: MatchQuarter;
  side: MatchTacticsSide;
  formation: FormationName;
  slots: FormationSlot[];
  corner_kick_player_id: string | null;
  free_kick_player_id: string | null;
  penalty_kick_player_id: string | null;
}

const MATCH_TACTICS_COLUMNS =
  "quarter, side, formation, slots, corner_kick_player_id, free_kick_player_id, penalty_kick_player_id";

function mapRowsToTacticsBySide(
  rows: MatchTacticsRow[],
  sport: TeamSport,
  playersPerSide: MatchPlayersPerSide,
  quarterCount: number,
): MatchTacticsBySide {
  const tacticsBySide = createDefaultMatchTacticsBySide(
    sport,
    playersPerSide,
    quarterCount,
  );
  const validQuarters = new Set(createQuarterOptions(quarterCount));
  const validFormations = new Set(
    getMatchFormationOptions(sport, playersPerSide),
  );

  rows.forEach((row) => {
    if (!validQuarters.has(row.quarter)) return;
    if (!validFormations.has(row.formation)) return;

    tacticsBySide[row.side][row.quarter] = {
      formation: row.formation,
      slots: row.slots,
      cornerKickPlayerId: row.corner_kick_player_id ?? "",
      freeKickPlayerId: row.free_kick_player_id ?? "",
      penaltyKickPlayerId: row.penalty_kick_player_id ?? "",
    };
  });

  return tacticsBySide;
}

export async function getMatchTacticsBySide(
  teamId: string,
  matchId: string,
  sport: TeamSport,
  playersPerSide: MatchPlayersPerSide,
  quarterCount: number,
): Promise<MatchTacticsBySide> {
  const { data, error } = await supabase
    .from("match_tactics")
    .select(MATCH_TACTICS_COLUMNS)
    .eq("team_id", teamId)
    .eq("match_id", matchId);

  if (error) {
    throw error;
  }

  return mapRowsToTacticsBySide(
    (data ?? []) as MatchTacticsRow[],
    sport,
    playersPerSide,
    quarterCount,
  );
}

export async function upsertMatchTacticsBySide(
  teamId: string,
  matchId: string,
  side: MatchTacticsSide,
  tacticsByQuarter: MatchTacticsByQuarter,
): Promise<void> {
  const rows = (
    Object.entries(tacticsByQuarter) as [
      MatchQuarter,
      MatchTacticsByQuarter[MatchQuarter],
    ][]
  ).map(([quarter, tactics]) => ({
    team_id: teamId,
    match_id: matchId,
    side,
    quarter,
    formation: tactics.formation,
    slots: tactics.slots,
    corner_kick_player_id: tactics.cornerKickPlayerId || null,
    free_kick_player_id: tactics.freeKickPlayerId || null,
    penalty_kick_player_id: tactics.penaltyKickPlayerId || null,
  }));

  const { error } = await supabase.from("match_tactics").upsert(rows, {
    onConflict: "match_id,quarter,side",
  });

  if (error) {
    throw error;
  }
}

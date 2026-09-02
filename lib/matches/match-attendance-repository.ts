import type {
  MatchAttendanceByMatchId,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import { supabase } from "../supabase";

interface MatchAttendanceRow {
  match_id: string;
  player_id: string;
  status: MatchAttendanceStatus;
}

function groupAttendanceByMatch(
  rows: MatchAttendanceRow[],
): MatchAttendanceByMatchId {
  return rows.reduce<MatchAttendanceByMatchId>((attendanceMap, row) => {
    const matchAttendance = attendanceMap[row.match_id] ?? [];

    return {
      ...attendanceMap,
      [row.match_id]: [
        ...matchAttendance,
        {
          playerId: row.player_id,
          status: row.status,
        },
      ],
    };
  }, {});
}

export async function getTeamMatchAttendance(
  teamId: string,
): Promise<MatchAttendanceByMatchId> {
  const { data, error } = await supabase
    .from("match_attendance")
    .select("match_id, player_id, status")
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }

  return groupAttendanceByMatch((data ?? []) as MatchAttendanceRow[]);
}

export async function upsertMatchAttendance(
  teamId: string,
  matchId: string,
  playerId: string,
  status: MatchAttendanceStatus,
): Promise<void> {
  const { error } = await supabase.from("match_attendance").upsert(
    {
      team_id: teamId,
      match_id: matchId,
      player_id: playerId,
      status,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "match_id,player_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function removeMatchAttendance(
  teamId: string,
  matchId: string,
  playerId: string,
) {
  const { data, error } = await supabase
    .from("match_attendance")
    .delete()
    .eq("team_id", teamId)
    .eq("match_id", matchId)
    .eq("player_id", playerId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  return data !== null;
}

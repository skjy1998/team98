import type {
  MatchAttendanceByMatchId,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MatchAttendanceRow = {
  id: string;
  match_id: string;
  player_id: string;
  status: MatchAttendanceStatus;
};

function groupAttendanceByMatch(
  rows: MatchAttendanceRow[],
): MatchAttendanceByMatchId {
  return rows.reduce<MatchAttendanceByMatchId>((acc, row) => {
    if (!acc[row.match_id]) {
      acc[row.match_id] = [];
    }

    acc[row.match_id].push({
      playerId: row.player_id,
      status: row.status,
    });

    return acc;
  }, {});
}

export function useMatchAttendance() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [attendance, setAttendance] = useState<MatchAttendanceByMatchId>({});
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);

  const loadAttendance = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setAttendance({});
      setAttendanceLoaded(true);
      return;
    }

    setAttendanceLoaded(false);

    const { data, error } = await supabase
      .from("match_attendance")
      .select("id, match_id, player_id, status")
      .eq("team_id", teamId);

    if (error || !data) {
      setAttendance({});
      setAttendanceLoaded(true);
      return;
    }

    setAttendance(groupAttendanceByMatch(data as MatchAttendanceRow[]));
    setAttendanceLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance();
  }, [loadAttendance]);

  const saveAttendance = async (
    matchId: string,
    playerId: string,
    status: MatchAttendanceStatus,
  ) => {
    if (!teamId) return false;

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

    if (error) return false;

    setAttendance((prev) => {
      const current = prev[matchId] ?? [];
      const filtered = current.filter((item) => item.playerId !== playerId);

      return {
        ...prev,
        [matchId]: [...filtered, { playerId, status }],
      };
    });

    return true;
  };

  const deleteAttendance = async (matchId: string, playerId: string) => {
    if (!teamId) return false;

    const { error } = await supabase
      .from("match_attendance")
      .delete()
      .eq("team_id", teamId)
      .eq("match_id", matchId)
      .eq("player_id", playerId);

    if (error) return false;

    setAttendance((prev) => {
      const current = prev[matchId] ?? [];
      return {
        ...prev,
        [matchId]: current.filter((item) => item.playerId !== playerId),
      };
    });

    return true;
  };

  return {
    attendance,
    attendanceLoaded,
    saveAttendance,
    deleteAttendance,
    reloadAttendance: loadAttendance,
  };
}

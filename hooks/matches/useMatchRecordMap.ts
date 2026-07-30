import type {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordMap,
  MatchRecordQuarter,
} from "@/types/match";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { supabase } from "@/lib/supabase";

type MatchRecordRow = {
  id: string;
  match_id: string;
  type: MatchRecordEventType;
  player_id: string | null;
  player_name: string | null;
  assist_player_id: string | null;
  assist_player_name: string | null;
  minute: string | null;
  quarter: MatchRecordQuarter;
  sort_order: number;
};

function mapRowToEvent(row: MatchRecordRow): MatchRecordEvent {
  return {
    id: row.id,
    type: row.type,
    playerId: row.player_id ?? "",
    playerName: row.player_name ?? "",
    assistPlayerId: row.assist_player_id ?? "",
    assistPlayerName: row.assist_player_name ?? "",
    minute: row.minute ?? "",
    quarter: row.quarter ?? "unknown",
  };
}

function groupRecords(rows: MatchRecordRow[]): MatchRecordMap {
  return rows.reduce<MatchRecordMap>((acc, row) => {
    const matchId = row.match_id;
    const prev = acc[matchId] ?? [];

    acc[matchId] = [...prev, mapRowToEvent(row)];
    return acc;
  }, {});
}

export default function useMatchRecordsMap() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [records, setRecords] = useState<MatchRecordMap>({});
  const [recordsLoaded, setRecordsLoaded] = useState(false);

  const loadRecords = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setRecords({});
      setRecordsLoaded(true);
      return;
    }

    setRecordsLoaded(false);

    const { data, error } = await supabase
      .from("match_records")
      .select(
        "id, match_id, type, player_id, player_name, assist_player_id, assist_player_name, minute, quarter, sort_order",
      )
      .eq("team_id", teamId)
      .order("match_id", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      setRecords({});
      setRecordsLoaded(true);
      return;
    }

    setRecords(groupRecords(data as MatchRecordRow[]));
    setRecordsLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecords();
  }, [loadRecords]);

  return { records, recordsLoaded, reloadRecords: loadRecords };
}

import type {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordMap,
  MatchRecordQuarter,
} from "@/types/match";
import { supabase } from "../supabase";

interface MatchRecordRow {
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
}

const MATCH_RECORD_COLUMNS =
  "id, match_id, type, player_id, player_name, assist_player_id, assist_player_name, minute, quarter, sort_order";

function mapMatchRecordRow(row: MatchRecordRow): MatchRecordEvent {
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

function groupMatchRecords(rows: MatchRecordRow[]): MatchRecordMap {
  return rows.reduce<MatchRecordMap>((recordMap, row) => {
    const matchRecords = recordMap[row.match_id] ?? [];

    return {
      ...recordMap,
      [row.match_id]: [...matchRecords, mapMatchRecordRow(row)],
    };
  }, {});
}

export async function getTeamMatchRecordMap(
  teamId: string,
): Promise<MatchRecordMap> {
  const { data, error } = await supabase
    .from("match_records")
    .select(MATCH_RECORD_COLUMNS)
    .eq("team_id", teamId)
    .order("match_id", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return groupMatchRecords((data ?? []) as MatchRecordRow[]);
}

export async function getMatchRecordEvents(
  teamId: string,
  matchId: string,
): Promise<MatchRecordEvent[]> {
  const { data, error } = await supabase
    .from("match_records")
    .select(MATCH_RECORD_COLUMNS)
    .eq("team_id", teamId)
    .eq("match_id", matchId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as MatchRecordRow[]).map(mapMatchRecordRow);
}

export async function createMatchRecordEvent(
  teamId: string,
  matchId: string,
  type: MatchRecordEventType,
  sortOrder: number,
): Promise<MatchRecordEvent> {
  const { data, error } = await supabase
    .from("match_records")
    .insert({
      team_id: teamId,
      match_id: matchId,
      type,
      player_id: null,
      player_name: "",
      assist_player_id: null,
      assist_player_name: "",
      minute: "",
      quarter: "unknown",
      sort_order: sortOrder,
    })
    .select(MATCH_RECORD_COLUMNS)
    .single();

  if (error || !data) {
    throw error ?? new Error("경기 기록 생성 결과가 없습니다.");
  }

  return mapMatchRecordRow(data as MatchRecordRow);
}

export async function updateMatchRecordEvent(
  teamId: string,
  matchId: string,
  eventId: string,
  updates: Partial<MatchRecordEvent>,
): Promise<MatchRecordEvent> {
  const { data, error } = await supabase
    .from("match_records")
    .update({
      player_id: updates.playerId || null,
      player_name: updates.playerName ?? "",
      assist_player_id: updates.assistPlayerId || null,
      assist_player_name: updates.assistPlayerName ?? "",
      minute: updates.minute ?? "",
      quarter: updates.quarter ?? "unknown",
    })
    .eq("id", eventId)
    .eq("team_id", teamId)
    .eq("match_id", matchId)
    .select(MATCH_RECORD_COLUMNS)
    .single();

  if (error || !data) {
    throw error ?? new Error("수정된 경기 기록이 없습니다.");
  }

  return mapMatchRecordRow(data as MatchRecordRow);
}

export async function removeMatchRecordEvent(
  teamId: string,
  matchId: string,
  eventId: string,
): Promise<void> {
  const { error } = await supabase
    .from("match_records")
    .delete()
    .eq("id", eventId)
    .eq("team_id", teamId)
    .eq("match_id", matchId);

  if (error) throw error;
}

export async function updateMatchRecordOrder(
  teamId: string,
  matchId: string,
  events: MatchRecordEvent[],
): Promise<void> {
  const results = await Promise.all(
    events.map((event, index) =>
      supabase
        .from("match_records")
        .update({ sort_order: index })
        .eq("id", event.id)
        .eq("team_id", teamId)
        .eq("match_id", matchId),
    ),
  );

  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) {
    throw failedResult.error;
  }
}

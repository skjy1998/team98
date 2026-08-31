import type {
  MatchCreateFormValue,
  MatchItem,
  MatchPlayersPerSide,
  MatchStatus,
  MatchType,
  MatchUniform,
} from "@/types/match";
import type { TeamSport } from "@/types/team";
import { supabase } from "../supabase";
import { getIsUpcomingMatch } from "./match-time";

interface MatchRow {
  id: string;
  season_id: string;
  title: string;
  type: MatchType;
  sport: TeamSport;
  players_per_side: MatchPlayersPerSide;
  quarter_count: number;
  quarter_duration_minutes: number;
  date: string;
  start_time: string;
  end_time: string;
  vote_deadline: string;
  location: string | null;
  opponent: string | null;
  uniform: MatchUniform;
  status: MatchStatus;
  our_score: number | null;
  opponent_score: number | null;
  record_completed_at: string | null;
  counts_toward_record: boolean;
}

const MATCH_COLUMNS = `
  id,
  season_id,
  title,
  type,
  sport,
  players_per_side,
  quarter_count,
  quarter_duration_minutes,
  date,
  start_time,
  end_time,
  vote_deadline,
  location,
  opponent,
  uniform,
  status,
  our_score,
  opponent_score,
  record_completed_at,
  counts_toward_record
`;

function mapMatchRow(match: MatchRow): MatchItem {
  return {
    id: match.id,
    seasonId: match.season_id,
    title: match.title,
    type: match.type,
    sport: match.sport,
    playersPerSide: match.players_per_side,
    quarterCount: match.quarter_count,
    quarterDurationMinutes: match.quarter_duration_minutes,
    date: match.date,
    startTime: match.start_time,
    endTime: match.end_time,
    voteDeadline: match.vote_deadline,
    location: match.location ?? undefined,
    opponent: match.opponent ?? undefined,
    uniform: match.uniform,
    status: match.status,
    ourScore: match.our_score ?? undefined,
    opponentScore: match.opponent_score ?? undefined,
    recordCompletedAt: match.record_completed_at ?? undefined,
    countsTowardRecord: match.counts_toward_record ?? match.type !== "자체전",
    isUpcoming: getIsUpcomingMatch(match.date, match.start_time),
  };
}

export async function getActiveSeasonId(teamId: string) {
  const { data, error } = await supabase
    .from("team_seasons")
    .select("id")
    .eq("team_id", teamId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id;
}

export async function getTeamMatches(teamId: string, seasonId?: string) {
  let query = supabase
    .from("matches")
    .select(MATCH_COLUMNS)
    .eq("team_id", teamId);

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as MatchRow[]).map(mapMatchRow);
}

export async function createTeamMatch(
  teamId: string,
  value: MatchCreateFormValue,
) {
  const activeSeasonId = await getActiveSeasonId(teamId);

  if (!activeSeasonId) {
    return null;
  }

  const { data, error } = await supabase
    .from("matches")
    .insert({
      team_id: teamId,
      season_id: activeSeasonId,
      title: value.title,
      type: value.type,
      sport: value.sport,
      players_per_side: value.playersPerSide,
      quarter_count: value.quarterCount,
      quarter_duration_minutes: value.quarterDurationMinutes,
      date: value.date,
      start_time: value.startTime,
      end_time: value.endTime,
      vote_deadline: new Date(value.voteDeadline).toISOString(),
      location: value.location,
      opponent: value.opponent ?? null,
      uniform: value.uniform,
      status: "scheduled",
      counts_toward_record: value.type !== "자체전",
    })
    .select(MATCH_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapMatchRow(data as MatchRow);
}

export async function updateTeamMatch(
  matchId: string,
  value: MatchCreateFormValue,
) {
  const { data, error } = await supabase.rpc(
    "update_match_with_tactics_reset",
    {
      p_match_id: matchId,
      p_title: value.title,
      p_type: value.type,
      p_sport: value.sport,
      p_players_per_side: value.playersPerSide,
      p_quarter_count: value.quarterCount,
      p_quarter_duration_minutes: value.quarterDurationMinutes,
      p_date: value.date,
      p_start_time: value.startTime,
      p_end_time: value.endTime,
      p_vote_deadline: new Date(value.voteDeadline).toISOString(),
      p_location: value.location,
      p_opponent: value.type === "정규" ? (value.opponent ?? "") : "",
      p_uniform: value.uniform,
    },
  );

  if (error) {
    throw error;
  }

  const updatedRow = (Array.isArray(data) ? data[0] : data) as
    | MatchRow
    | undefined;

  if (!updatedRow) {
    throw new Error("Updated match row was not returned");
  }

  return mapMatchRow(updatedRow);
}

export async function updateTeamMatchPlayersPerSide(
  teamId: string,
  matchId: string,
  playersPerSide: MatchPlayersPerSide,
) {
  const { data, error } = await supabase
    .from("matches")
    .update({
      players_per_side: playersPerSide,
    })
    .eq("id", matchId)
    .eq("team_id", teamId)
    .select(MATCH_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapMatchRow(data as MatchRow);
}

export async function updateTeamMatchRecordInclusion(
  teamId: string,
  matchId: string,
  countsTowardRecord: boolean,
) {
  const { data, error } = await supabase
    .from("matches")
    .update({
      counts_toward_record: countsTowardRecord,
    })
    .eq("id", matchId)
    .eq("team_id", teamId)
    .select(MATCH_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapMatchRow(data as MatchRow);
}

export async function updateTeamMatchRecordCompletion(
  matchId: string,
  completed: boolean,
) {
  const { error } = await supabase.rpc("set_match_record_completion", {
    p_match_id: matchId,
    p_completed: completed,
  });

  if (error) {
    throw error;
  }
}

export async function deleteTeamMatch(teamId: string, matchId: string) {
  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", matchId)
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }
}

import { getIsUpcomingMatch } from "@/lib/matches/match-ui";
import {
  MatchCreateFormValue,
  MatchItem,
  MatchStatus,
  MatchType,
  MatchUniform,
} from "@/types/match";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { supabase } from "@/lib/supabase";

type MatchRow = {
  id: string;
  title: string;
  type: MatchType;
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
};

const MATCH_COLUMNS = `
  id,
  title,
  type,
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
  record_completed_at
`;

function mapMatchRow(match: MatchRow): MatchItem {
  return {
    id: match.id,
    title: match.title,
    type: match.type,
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
    isUpcoming: getIsUpcomingMatch(match.date),
  };
}

export function useMatches() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [matchesLoaded, setMatchesLoaded] = useState(false);

  const loadMatches = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setMatches([]);
      setMatchesLoaded(true);
      return;
    }

    setMatchesLoaded(false);

    const { data, error } = await supabase
      .from("matches")
      .select(MATCH_COLUMNS)
      .eq("team_id", teamId)
      .order("date", { ascending: true });

    if (error || !data) {
      setMatches([]);
      setMatchesLoaded(true);
      return;
    }

    setMatches(data.map((match) => mapMatchRow(match as MatchRow)));
    setMatchesLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMatches();
  }, [loadMatches]);

  const addMatch = async (value: MatchCreateFormValue) => {
    if (!teamId) return false;

    const { data, error } = await supabase
      .from("matches")
      .insert({
        team_id: teamId,
        title: value.title,
        type: value.type,
        date: value.date,
        start_time: value.startTime,
        end_time: value.endTime,
        vote_deadline: new Date(value.voteDeadline).toISOString(),
        location: value.location,
        opponent: value.opponent ?? null,
        uniform: value.uniform,
        status: "scheduled",
      })
      .select(MATCH_COLUMNS)
      .single();

    if (error || !data) {
      return false;
    }

    setMatches((prev) => [mapMatchRow(data as MatchRow), ...prev]);
    return true;
  };

  const updateMatch = async (matchId: string, value: MatchCreateFormValue) => {
    if (!teamId) return false;

    const { data, error } = await supabase
      .from("matches")
      .update({
        title: value.title,
        type: value.type,
        date: value.date,
        start_time: value.startTime,
        end_time: value.endTime,
        vote_deadline: new Date(value.voteDeadline).toISOString(),
        location: value.location,
        opponent: value.type === "정규" ? (value.opponent ?? null) : null,
        uniform: value.uniform,
      })
      .eq("id", matchId)
      .select(MATCH_COLUMNS)
      .single();

    if (error || !data) {
      return false;
    }

    setMatches((prev) =>
      prev.map((item) =>
        item.id === matchId ? mapMatchRow(data as MatchRow) : item,
      ),
    );

    return true;
  };

  const setMatchRecordCompletion = async (
    matchId: string,
    completed: boolean,
  ) => {
    const { error } = await supabase.rpc("set_match_record_completion", {
      p_match_id: matchId,
      p_completed: completed,
    });

    if (error) {
      console.error("set match record completion error", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return false;
    }

    await loadMatches();
    return true;
  };

  const deleteMatch = async (matchId: string) => {
    if (!teamId) return false;

    const { error } = await supabase.from("matches").delete().eq("id", matchId);

    if (error) {
      return false;
    }

    setMatches((prev) => prev.filter((item) => item.id !== matchId));
    return true;
  };

  return {
    matches,
    addMatch,
    updateMatch,
    setMatchRecordCompletion,
    deleteMatch,
    matchesLoaded,
    reloadMatches: loadMatches,
  };
}

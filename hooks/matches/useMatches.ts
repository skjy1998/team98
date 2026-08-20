import { getIsUpcomingMatch } from "@/lib/matches/match-ui";
import {
  MatchCreateFormValue,
  MatchItem,
  MatchPlayersPerSide,
  MatchStatus,
  MatchType,
  MatchUniform,
} from "@/types/match";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { supabase } from "@/lib/supabase";
import { useToastStore } from "@/stores/toast-store";
import type { TeamSport } from "@/types/team";

interface UseMatchesOptions {
  includeAllSeasons?: boolean;
  seasonId?: string;
}

type MatchRow = {
  id: string;
  season_id: string;
  title: string;
  type: MatchType;
  sport: TeamSport;
  players_per_side: MatchPlayersPerSide;
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
  season_id,
  title,
  type,
  sport,
  players_per_side,
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
    seasonId: match.season_id,
    title: match.title,
    type: match.type,
    sport: match.sport,
    playersPerSide: match.players_per_side,
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

export function useMatches({
  includeAllSeasons = false,
  seasonId,
}: UseMatchesOptions = {}) {
  const showToast = useToastStore((state) => state.showToast);

  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [matchesLoaded, setMatchesLoaded] = useState(false);
  const [activeSeason, setActiveSeason] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const loadMatches = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setMatches([]);
      setActiveSeason(null);
      setMatchesLoaded(true);
      return;
    }

    setMatchesLoaded(false);

    let targetSeasonId = seasonId;

    if (includeAllSeasons || seasonId) {
      setActiveSeason(null);
    }

    if (!includeAllSeasons && !targetSeasonId) {
      const { data: activeSeasonData, error: seasonError } = await supabase
        .from("team_seasons")
        .select("id, name")
        .eq("team_id", teamId)
        .eq("is_active", true)
        .maybeSingle();

      if (seasonError || !activeSeasonData) {
        console.error("active season load error", seasonError);
        setActiveSeason(null);
        setMatches([]);
        setMatchesLoaded(true);
        return;
      }

      setActiveSeason(activeSeasonData);
      targetSeasonId = activeSeasonData.id;
    }

    let query = supabase
      .from("matches")
      .select(MATCH_COLUMNS)
      .eq("team_id", teamId);

    if (targetSeasonId) {
      query = query.eq("season_id", targetSeasonId);
    }

    const { data, error } = await query.order("date", {
      ascending: true,
    });

    if (error || !data) {
      console.error("matches load error", error);
      setMatches([]);
      setMatchesLoaded(true);
      return;
    }

    setMatches(data.map((match) => mapMatchRow(match as MatchRow)));
    setMatchesLoaded(true);
  }, [teamLoaded, teamId, includeAllSeasons, seasonId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMatches();
  }, [loadMatches]);

  const addMatch = async (value: MatchCreateFormValue) => {
    if (!teamId) return false;

    const { data: activeSeason, error: seasonError } = await supabase
      .from("team_seasons")
      .select("id")
      .eq("team_id", teamId)
      .eq("is_active", true)
      .maybeSingle();

    if (seasonError || !activeSeason) {
      console.error("active season load error", seasonError);
      showToast(
        "활성 시즌이 없습니다. 설정에서 활성 시즌을 먼저 지정해 주세요.",
        "info",
      );
      return false;
    }

    const { data, error } = await supabase
      .from("matches")
      .insert({
        team_id: teamId,
        season_id: activeSeason.id,
        title: value.title,
        type: value.type,
        sport: value.sport,
        players_per_side: value.playersPerSide,
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
      console.error("match create error", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });

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
        sport: value.sport,
        players_per_side: value.playersPerSide,
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
      console.error("match update error", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      return false;
    }

    setMatches((prev) =>
      prev.map((item) =>
        item.id === matchId ? mapMatchRow(data as MatchRow) : item,
      ),
    );

    return true;
  };

  const updateMatchPlayersPerSide = async (
    matchId: string,
    playersPerSide: MatchPlayersPerSide,
  ) => {
    if (!teamId) return false;

    const { data, error } = await supabase
      .from("matches")
      .update({
        players_per_side: playersPerSide,
      })
      .eq("id", matchId)
      .eq("team_id", teamId)
      .select(MATCH_COLUMNS)
      .single();

    if (error || !data) {
      console.error("match player count update error", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });

      return false;
    }

    setMatches((current) =>
      current.map((match) =>
        match.id === matchId ? mapMatchRow(data as MatchRow) : match,
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
    matchesLoaded,
    activeSeason,
    addMatch,
    updateMatch,
    updateMatchPlayersPerSide,
    setMatchRecordCompletion,
    deleteMatch,
    reloadMatches: loadMatches,
  };
}

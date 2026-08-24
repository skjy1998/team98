import type { MatchVotesByMatchId, VoteStatus } from "@/types/match-vote";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { supabase } from "@/lib/supabase";
import type { SelfMatchSide } from "@/types/match";

type MatchVoteRow = {
  id: string;
  match_id: string;
  player_id: string;
  status: VoteStatus;
  side: SelfMatchSide | null;
};

function groupVotesByMatch(rows: MatchVoteRow[]): MatchVotesByMatchId {
  return rows.reduce<MatchVotesByMatchId>((acc, row) => {
    if (!acc[row.match_id]) {
      acc[row.match_id] = [];
    }

    acc[row.match_id].push({
      playerId: row.player_id,
      status: row.status,
      side: row.side ?? undefined,
    });

    return acc;
  }, {});
}

export function useMatchVotes() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [votes, setVotes] = useState<MatchVotesByMatchId>({});
  const [votesLoaded, setVotesLoaded] = useState(false);

  const loadVotes = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setVotes({});
      setVotesLoaded(true);
      return;
    }

    setVotesLoaded(false);

    const { data, error } = await supabase
      .from("match_votes")
      .select("id, match_id, player_id, status, side")
      .eq("team_id", teamId);

    if (error || !data) {
      setVotes({});
      setVotesLoaded(true);
      return;
    }

    setVotes(groupVotesByMatch(data as MatchVoteRow[]));
    setVotesLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVotes();
  }, [loadVotes]);

  const saveVote = async (
    matchId: string,
    playerId: string,
    status: VoteStatus,
  ) => {
    if (!teamId) return false;

    const currentVote = votes[matchId]?.find(
      (vote) => vote.playerId === playerId,
    );

    if (status !== "attend" && currentVote?.side) {
      const sideCleared = await saveVoteSide(matchId, playerId, null);

      if (!sideCleared) {
        return false;
      }
    }

    const nextSide = status === "attend" ? (currentVote?.side ?? null) : null;

    const { error } = await supabase.from("match_votes").upsert(
      {
        team_id: teamId,
        match_id: matchId,
        player_id: playerId,
        status,
        side: nextSide,
      },
      {
        onConflict: "match_id,player_id",
      },
    );

    if (error) {
      return false;
    }

    setVotes((prev) => {
      const currentVotes = prev[matchId] ?? [];
      const filtered = currentVotes.filter(
        (vote) => vote.playerId !== playerId,
      );

      return {
        ...prev,
        [matchId]: [
          ...filtered,
          { playerId, status, side: nextSide ?? undefined },
        ],
      };
    });

    return true;
  };

  const saveVoteSide = async (
    matchId: string,
    playerId: string,
    side: SelfMatchSide | null,
  ) => {
    if (!teamId) return false;

    const currentVote = votes[matchId]?.find(
      (vote) => vote.playerId === playerId,
    );

    if (currentVote?.status !== "attend") {
      return false;
    }

    const { data, error } = await supabase.rpc("set_self_match_player_side", {
      p_match_id: matchId,
      p_player_id: playerId,
      p_side: side,
    });

    if (error || data !== true) {
      console.error("self match side update error", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });

      return false;
    }

    setVotes((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).map((vote) =>
        vote.playerId === playerId
          ? {
              ...vote,
              side: side ?? undefined,
            }
          : vote,
      ),
    }));

    return true;
  };

  const deleteVote = async (matchId: string, playerId: string) => {
    if (!teamId) return false;

    const currentVote = votes[matchId]?.find(
      (vote) => vote.playerId === playerId,
    );

    if (currentVote?.side) {
      const sideCleared = await saveVoteSide(matchId, playerId, null);

      if (!sideCleared) {
        return false;
      }
    }

    const { error } = await supabase
      .from("match_votes")
      .delete()
      .eq("team_id", teamId)
      .eq("match_id", matchId)
      .eq("player_id", playerId);

    if (error) {
      return false;
    }

    setVotes((current) => ({
      ...current,
      [matchId]: (current[matchId] ?? []).filter(
        (vote) => vote.playerId !== playerId,
      ),
    }));

    return true;
  };

  return {
    votes,
    votesLoaded,
    saveVote,
    saveVoteSide,
    deleteVote,
    reloadVotes: loadVotes,
  };
}

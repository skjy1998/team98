import type { MatchVotesByMatchId, VoteStatus } from "@/types/match-vote";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import type { SelfMatchSide } from "@/types/match";
import {
  getTeamMatchVotes,
  removeTeamMatchVote,
  updateSelfMatchPlayerSide,
  upsertTeamMatchVote,
} from "@/lib/matches/match-vote-repository";

export function useMatchVotes() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [votes, setVotes] = useState<MatchVotesByMatchId>({});
  const [votesLoaded, setVotesLoaded] = useState(false);
  const [votesError, setVotesError] = useState("");

  const loadVotes = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setVotes({});
      setVotesLoaded(true);
      setVotesError("");
      return;
    }

    setVotesLoaded(false);
    setVotesError("");

    try {
      const nextVotes = await getTeamMatchVotes(teamId);
      setVotes(nextVotes);
    } catch (error) {
      console.error("match votes load error", error);
      setVotes({});
      setVotesError("투표 정보를 불러오지 못했어요.");
    } finally {
      setVotesLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVotes();
  }, [loadVotes]);

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

    try {
      await updateSelfMatchPlayerSide(matchId, playerId, side);

      setVotes((currentVotes) => ({
        ...currentVotes,
        [matchId]: (currentVotes[matchId] ?? []).map((vote) =>
          vote.playerId === playerId
            ? {
                ...vote,
                side: side ?? undefined,
              }
            : vote,
        ),
      }));

      return true;
    } catch (error) {
      console.error("self match side update error", error);
      return false;
    }
  };

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

    try {
      await upsertTeamMatchVote(teamId, matchId, playerId, status, nextSide);

      setVotes((previousVotes) => {
        const currentVotes = previousVotes[matchId] ?? [];
        const remainingVotes = currentVotes.filter(
          (vote) => vote.playerId !== playerId,
        );

        return {
          ...previousVotes,
          [matchId]: [
            ...remainingVotes,
            {
              playerId,
              status,
              side: nextSide ?? undefined,
            },
          ],
        };
      });

      return true;
    } catch (error) {
      console.error("match vote save error", error);
      return false;
    }
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

    try {
      await removeTeamMatchVote(teamId, matchId, playerId);

      setVotes((currentVotes) => ({
        ...currentVotes,
        [matchId]: (currentVotes[matchId] ?? []).filter(
          (vote) => vote.playerId !== playerId,
        ),
      }));

      return true;
    } catch (error) {
      console.error("match vote delete error", error);
      return false;
    }
  };

  return {
    votes,
    votesLoaded,
    votesError,
    saveVote,
    saveVoteSide,
    deleteVote,
    reloadVotes: loadVotes,
  };
}

import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import type { MatchMvpVotesByMatchId } from "@/types/match-mvp";
import {
  getTeamMatchMvpVotes,
  removeMatchMvpVote,
  upsertMatchMvpVote,
} from "@/lib/matches/match-mvp-repository";

export function useMatchMvpVotes() {
  const { team, teamLoaded } = useCurrentTeam();
  const { member, memberLoaded } = useCurrentTeamMember();

  const teamId = team?.id;
  const currentUserId = member?.userId;

  const [mvpVotes, setMvpVotes] = useState<MatchMvpVotesByMatchId>({});
  const [mvpVotesLoaded, setMvpVotesLoaded] = useState(false);
  const [mvpVotesError, setMvpVotesError] = useState("");

  const loadMvpVotes = useCallback(async () => {
    if (!teamLoaded || !memberLoaded) return;

    if (!teamId || !currentUserId) {
      setMvpVotes({});
      setMvpVotesLoaded(true);
      setMvpVotesError("");
      return;
    }

    setMvpVotesLoaded(false);
    setMvpVotesError("");

    try {
      const nextVotes = await getTeamMatchMvpVotes(teamId);
      setMvpVotes(nextVotes);
    } catch (error) {
      console.error("match mvp votes load error", error);
      setMvpVotes({});
      setMvpVotesError("MVP 투표 정보를 불러오지 못했어요.");
    } finally {
      setMvpVotesLoaded(true);
    }
  }, [teamLoaded, memberLoaded, teamId, currentUserId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMvpVotes();
  }, [loadMvpVotes]);

  const saveMvpVote = async (matchId: string, candidatePlayerId: string) => {
    if (!teamId || !currentUserId) return false;

    try {
      const savedVote = await upsertMatchMvpVote(
        teamId,
        matchId,
        candidatePlayerId,
      );

      setMvpVotes((previousVotes) => {
        const matchVotes = previousVotes[matchId] ?? [];
        const otherVotes = matchVotes.filter(
          (vote) => vote.voterUserId !== currentUserId,
        );

        return {
          ...previousVotes,
          [matchId]: [...otherVotes, savedVote],
        };
      });

      return true;
    } catch (error) {
      console.error("match mvp vote save error", error);
      return false;
    }
  };

  const deleteMvpVote = async (matchId: string) => {
    if (!teamId || !currentUserId) return false;

    try {
      const removed = await removeMatchMvpVote(teamId, matchId);

      if (!removed) return false;

      setMvpVotes((previousVotes) => ({
        ...previousVotes,
        [matchId]: (previousVotes[matchId] ?? []).filter(
          (vote) => vote.voterUserId !== currentUserId,
        ),
      }));

      return true;
    } catch (error) {
      console.error("match mvp vote delete error", error);
      return false;
    }
  };

  return {
    mvpVotes,
    mvpVotesLoaded,
    mvpVotesError,
    currentUserId,
    saveMvpVote,
    deleteMvpVote,
    reloadMvpVotes: loadMvpVotes,
  };
}

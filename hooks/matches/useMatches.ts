import {
  MatchCreateFormValue,
  MatchItem,
  MatchPlayersPerSide,
} from "@/types/match";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useToastStore } from "@/stores/toast-store";
import {
  getActiveSeasonId,
  getTeamMatches,
  createTeamMatch,
  updateTeamMatch,
  updateTeamMatchPlayersPerSide,
  updateTeamMatchRecordInclusion,
  updateTeamMatchRecordCompletion,
  deleteTeamMatch,
} from "@/lib/matches/match-repository";

interface UseMatchesOptions {
  includeAllSeasons?: boolean;
  seasonId?: string;
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
  const [matchesError, setMatchesError] = useState("");

  const loadMatches = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setMatches([]);
      setMatchesLoaded(true);
      setMatchesError("");
      return;
    }

    setMatchesLoaded(false);
    setMatchesError("");

    try {
      let targetSeasonId = seasonId;

      if (!includeAllSeasons && !targetSeasonId) {
        targetSeasonId = await getActiveSeasonId(teamId);

        if (!targetSeasonId) {
          setMatches([]);
          setMatchesError(
            "활성 시즌이 없습니다. 설정에서 활성 시즌을 먼저 지정해 주세요.",
          );
          return;
        }
      }

      const nextMatches = await getTeamMatches(teamId, targetSeasonId);

      setMatches(nextMatches);
    } catch (error) {
      console.error("match load error", error);
      setMatches([]);
      setMatchesError("경기 일정을 불러오지 못했어요.");
    } finally {
      setMatchesLoaded(true);
    }
  }, [teamLoaded, teamId, includeAllSeasons, seasonId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMatches();
  }, [loadMatches]);

  const addMatch = async (value: MatchCreateFormValue) => {
    if (!teamId) return false;

    try {
      const createdMatch = await createTeamMatch(teamId, value);

      if (!createdMatch) {
        showToast(
          "활성 시즌이 없습니다. 설정에서 활성 시즌을 먼저 지정해 주세요.",
          "info",
        );

        return false;
      }

      setMatches((current) => [createdMatch, ...current]);

      return true;
    } catch (error) {
      console.error("match create error", error);
      return false;
    }
  };

  const updateMatch = async (matchId: string, value: MatchCreateFormValue) => {
    if (!teamId) return false;

    try {
      const updatedMatch = await updateTeamMatch(matchId, value);

      setMatches((current) =>
        current.map((match) => (match.id === matchId ? updatedMatch : match)),
      );

      return true;
    } catch (error) {
      console.error("match update error", error);
      return false;
    }
  };

  const updateMatchPlayersPerSide = async (
    matchId: string,
    playersPerSide: MatchPlayersPerSide,
  ) => {
    if (!teamId) return false;

    try {
      const updatedMatch = await updateTeamMatchPlayersPerSide(
        teamId,
        matchId,
        playersPerSide,
      );

      setMatches((current) =>
        current.map((match) => (match.id === matchId ? updatedMatch : match)),
      );

      return true;
    } catch (error) {
      console.error("match player count update error", error);

      return false;
    }
  };

  const updateMatchRecordInclusion = async (
    matchId: string,
    countsTowardRecord: boolean,
  ) => {
    if (!teamId) return false;

    try {
      const updatedMatch = await updateTeamMatchRecordInclusion(
        teamId,
        matchId,
        countsTowardRecord,
      );

      setMatches((current) =>
        current.map((match) => (match.id === matchId ? updatedMatch : match)),
      );

      return true;
    } catch (error) {
      console.error("match record inclusion update error", error);

      return false;
    }
  };

  const setMatchRecordCompletion = async (
    matchId: string,
    completed: boolean,
  ) => {
    try {
      await updateTeamMatchRecordCompletion(matchId, completed);

      await loadMatches();
      return true;
    } catch (error) {
      console.error("set match record completion error", error);
    }

    return false;
  };

  const deleteMatch = async (matchId: string) => {
    if (!teamId) return false;

    try {
      await deleteTeamMatch(teamId, matchId);

      setMatches((current) => current.filter((match) => match.id !== matchId));

      return true;
    } catch (error) {
      console.error("match delete error", error);
      return false;
    }
  };

  return {
    matches,
    matchesLoaded,
    matchesError,
    addMatch,
    updateMatch,
    updateMatchPlayersPerSide,
    updateMatchRecordInclusion,
    setMatchRecordCompletion,
    deleteMatch,
    reloadMatches: loadMatches,
  };
}

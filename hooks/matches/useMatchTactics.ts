import { createDefaultMatchTacticsBySide } from "@/lib/tactics/tactics-ui";
import type {
  MatchTacticsByQuarter,
  MatchTacticsBySide,
  MatchTacticsSide,
} from "@/types/tactics";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import type { TeamSport } from "@/types/team";
import type { MatchPlayersPerSide } from "@/types/match";
import {
  getMatchTacticsBySide,
  upsertMatchTacticsBySide,
} from "@/lib/matches/match-tactics-repository";

export function useMatchTactics(
  matchId: string,
  sport: TeamSport,
  playersPerSide: MatchPlayersPerSide,
  quarterCount: number,
) {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;
  const [tacticsBySide, setTacticsBySide] = useState<MatchTacticsBySide>(() =>
    createDefaultMatchTacticsBySide(sport, playersPerSide, quarterCount),
  );
  const [tacticsLoaded, setTacticsLoaded] = useState(false);
  const [tacticsError, setTacticsError] = useState("");

  const loadMatchTactics = useCallback(async () => {
    if (!teamLoaded) return;

    const defaultTactics = createDefaultMatchTacticsBySide(
      sport,
      playersPerSide,
      quarterCount,
    );

    if (!teamId || !matchId) {
      setTacticsBySide(defaultTactics);
      setTacticsLoaded(true);
      setTacticsError("");
      return;
    }

    setTacticsLoaded(false);
    setTacticsError("");

    try {
      const nextTactics = await getMatchTacticsBySide(
        teamId,
        matchId,
        sport,
        playersPerSide,
        quarterCount,
      );

      setTacticsBySide(nextTactics);
    } catch (error) {
      console.error("match tactics load error", error);
      setTacticsBySide(defaultTactics);
      setTacticsError("경기 전술을 불러오지 못했어요.");
    } finally {
      setTacticsLoaded(true);
    }
  }, [teamLoaded, teamId, matchId, sport, playersPerSide, quarterCount]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMatchTactics();
  }, [loadMatchTactics]);

  const saveTacticsBySide = async (
    side: MatchTacticsSide,
    updater:
      | MatchTacticsByQuarter
      | ((current: MatchTacticsByQuarter) => MatchTacticsByQuarter),
  ) => {
    if (!teamId || !matchId) return false;

    const currentTactics = tacticsBySide[side];
    const nextTactics =
      typeof updater === "function" ? updater(currentTactics) : updater;

    setTacticsBySide((current) => ({
      ...current,
      [side]: nextTactics,
    }));

    try {
      await upsertMatchTacticsBySide(teamId, matchId, side, nextTactics);

      return true;
    } catch (error) {
      console.error("match tactics save error", error);
      await loadMatchTactics();
      return false;
    }
  };

  return {
    tacticsBySide,
    saveTacticsBySide,
    tacticsLoaded,
    tacticsError,
    reloadMatchTactics: loadMatchTactics,
  };
}

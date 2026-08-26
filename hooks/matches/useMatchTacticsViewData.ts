import { createQuarterOptions } from "@/lib/matches/match-quarter";
import {
  getAssignedPlayerIds,
  getAttendPlayerIds,
  getAvailableTacticsPlayers,
  getMatchFormationOptions,
  getPlayerById,
  sortPlayersByRecommendedPosition,
} from "@/lib/tactics/tactics-ui";
import type { MatchPlayersPerSide, MatchType } from "@/types/match";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import type {
  MatchQuarter,
  MatchTacticsBySide,
  MatchTacticsSide,
} from "@/types/tactics";
import type { TeamSport } from "@/types/team";
import { useMemo } from "react";

interface UseMatchTacticsViewDataParams {
  matchType: MatchType;
  sport: TeamSport;
  playersPerSide: MatchPlayersPerSide;
  quarterCount: number;
  players: PlayerType[];
  votes: MatchVote[];
  tacticsBySide: MatchTacticsBySide;
  selectedQuarter: MatchQuarter;
  selectedSide: MatchTacticsSide;
  selectedSlotId: string | null;
}

export function useMatchTacticsViewData({
  matchType,
  sport,
  playersPerSide,
  quarterCount,
  players,
  votes,
  tacticsBySide,
  selectedQuarter,
  selectedSide,
  selectedSlotId,
}: UseMatchTacticsViewDataParams) {
  const tacticsByQuarter = tacticsBySide[selectedSide];
  const currentTactics = tacticsByQuarter[selectedQuarter];

  const quarterOptions = useMemo(
    () => createQuarterOptions(quarterCount),
    [quarterCount],
  );

  const formationOptions = useMemo(
    () => getMatchFormationOptions(sport, playersPerSide),
    [sport, playersPerSide],
  );

  const selectedSlot = useMemo(
    () => currentTactics.slots.find((slot) => slot.id === selectedSlotId),
    [currentTactics.slots, selectedSlotId],
  );

  const currentSideVotes = useMemo(() => {
    if (matchType !== "자체전") {
      return votes;
    }

    return votes.filter((vote) => vote.side === selectedSide);
  }, [votes, matchType, selectedSide]);

  const attendPlayerIds = useMemo(
    () => getAttendPlayerIds(currentSideVotes),
    [currentSideVotes],
  );

  const assignedPlayerIds = useMemo(() => {
    if (matchType !== "자체전") {
      return getAssignedPlayerIds(currentTactics.slots);
    }

    const teamASlots = tacticsBySide.team_a[selectedQuarter].slots;
    const teamBSlots = tacticsBySide.team_b[selectedQuarter].slots;

    return getAssignedPlayerIds([...teamASlots, ...teamBSlots]);
  }, [matchType, currentTactics.slots, tacticsBySide, selectedQuarter]);

  const availablePlayers = useMemo(
    () =>
      getAvailableTacticsPlayers(players, attendPlayerIds, assignedPlayerIds),
    [players, attendPlayerIds, assignedPlayerIds],
  );

  const sortedAvailablePlayers = useMemo(
    () => sortPlayersByRecommendedPosition(availablePlayers, selectedSlot),
    [availablePlayers, selectedSlot],
  );

  const assignedPlayers = useMemo(() => {
    const assignedIds = new Set(
      currentTactics.slots.flatMap((slot) =>
        slot.playerId ? [slot.playerId] : [],
      ),
    );

    return players.filter((player) => assignedIds.has(player.id));
  }, [players, currentTactics.slots]);

  const findPlayerById = (playerId?: string) =>
    getPlayerById(players, playerId);

  return {
    tacticsByQuarter,
    currentTactics,
    quarterOptions,
    formationOptions,
    selectedSlot,
    assignedPlayerIds,
    sortedAvailablePlayers,
    assignedPlayers,
    findPlayerById,
  };
}

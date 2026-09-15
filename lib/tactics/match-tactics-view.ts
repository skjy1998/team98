import { createQuarterOptions } from "@/lib/matches/match-quarter";
import {
  getAssignedPlayerIds,
  getAttendPlayerIds,
  getAvailableTacticsPlayers,
  getMatchFormationOptions,
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

interface MatchTacticsViewDataParams {
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

export function getMatchTacticsViewData({
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
}: MatchTacticsViewDataParams) {
  const tacticsByQuarter = tacticsBySide[selectedSide];
  const currentTactics = tacticsByQuarter[selectedQuarter];

  const quarterOptions = createQuarterOptions(quarterCount);

  const formationOptions = getMatchFormationOptions(sport, playersPerSide);

  const selectedSlot = currentTactics.slots.find(
    (slot) => slot.id === selectedSlotId,
  );

  const currentSideVotes =
    matchType === "자체전"
      ? votes.filter((vote) => vote.side === selectedSide)
      : votes;

  const attendPlayerIds = getAttendPlayerIds(currentSideVotes);

  const assignedSlots =
    matchType === "자체전"
      ? [
          ...tacticsBySide.team_a[selectedQuarter].slots,
          ...tacticsBySide.team_b[selectedQuarter].slots,
        ]
      : currentTactics.slots;

  const assignedPlayerIds = getAssignedPlayerIds(assignedSlots);

  const availablePlayers = getAvailableTacticsPlayers(
    players,
    attendPlayerIds,
    assignedPlayerIds,
  );

  const sortedAvailablePlayers = sortPlayersByRecommendedPosition(
    availablePlayers,
    selectedSlot,
  );

  const currentSideAssignedPlayerIds = getAssignedPlayerIds(
    currentTactics.slots,
  );

  const assignedPlayers = players.filter((player) =>
    currentSideAssignedPlayerIds.has(player.id),
  );

  const playerById = new Map(players.map((player) => [player.id, player]));

  const findPlayerById = (playerId?: string) =>
    playerId ? playerById.get(playerId) : undefined;

  return {
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

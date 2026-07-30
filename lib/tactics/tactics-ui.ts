import { formationTemplate } from "@/data/formationTemplates";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerDetailPosition, PlayerType } from "@/types/player";
import type {
  FormationSlot,
  MatchQuarter,
  MatchTacticsByQuarter,
  QuarterTacticsState,
} from "@/types/tactics";

export const quarterOptions: MatchQuarter[] = ["1Q", "2Q", "3Q", "4Q"];

export const createDefaultQuarterTactics = (): QuarterTacticsState => ({
  formation: "4-4-2",
  slots: formationTemplate["4-4-2"],
  cornerKickPlayerId: "",
  freeKickPlayerId: "",
  penaltyKickPlayerId: "",
});

export const createDefaultMatchTactics = (): MatchTacticsByQuarter => ({
  "1Q": createDefaultQuarterTactics(),
  "2Q": createDefaultQuarterTactics(),
  "3Q": createDefaultQuarterTactics(),
  "4Q": createDefaultQuarterTactics(),
});

export function normalizeSlotLabel(label?: string): PlayerDetailPosition | "" {
  if (!label) return "";

  const normalizedMap: Record<string, PlayerDetailPosition> = {
    GK: "GK",
    LB: "LB",
    RB: "RB",
    CB: "CB",
    LCB: "CB",
    RCB: "CB",
    CDM: "CDM",
    LCDM: "CDM",
    RCDM: "CDM",
    CM: "CM",
    LCM: "CM",
    RCM: "CM",
    LM: "CM",
    RM: "CM",
    CAM: "CAM",
    LAM: "CAM",
    RAM: "CAM",
    LW: "LW",
    RW: "RW",
    ST: "ST",
    LS: "ST",
    RS: "ST",
  };
  return normalizedMap[label] ?? "";
}

export function sortPlayersByRecommendedPosition(
  players: PlayerType[],
  selectedSlot?: FormationSlot,
) {
  const sortedByName = [...players].sort((a, b) =>
    a.name.localeCompare(b.name, "ko"),
  );

  if (!selectedSlot) {
    return sortedByName.map((player) => ({
      ...player,
      isRecommended: false,
    }));
  }
  const targetPosition = normalizeSlotLabel(selectedSlot.label);

  return sortedByName
    .map((player) => ({
      ...player,
      isRecommended: targetPosition
        ? (player.detailPositions?.includes(targetPosition) ?? false)
        : false,
    }))
    .sort((a, b) => {
      if (a.isRecommended !== b.isRecommended) {
        return a.isRecommended ? -1 : 1;
      }

      return a.name.localeCompare(b.name, "ko");
    });
}

export function getPlayerById(players: PlayerType[], playerId?: string) {
  return players.find((player) => player.id === playerId);
}

export function getAttendPlayerIds(currentVotes: MatchVote[]) {
  return new Set(
    currentVotes
      .filter((vote) => vote.status === "attend")
      .map((vote) => vote.playerId),
  );
}

export function getAssignedPlayerIds(slots: QuarterTacticsState["slots"]) {
  return new Set(
    slots.flatMap((slot) => (slot.playerId ? [slot.playerId] : [])),
  );
}

export function getAvailableTacticsPlayers(
  players: PlayerType[],
  attendPlayerIds: Set<string>,
  assignedPlayerIds: Set<string>,
) {
  return players.filter(
    (player) =>
      attendPlayerIds.has(player.id) && !assignedPlayerIds.has(player.id),
  );
}

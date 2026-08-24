import { formationTemplate } from "@/data/formationTemplates";
import { futsalFormationTemplates } from "@/data/futsalFormationTemplate";
import type { MatchPlayersPerSide } from "@/types/match";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerDetailPosition, PlayerType } from "@/types/player";
import type {
  FormationName,
  FormationSlot,
  MatchTacticsByQuarter,
  MatchTacticsBySide,
  QuarterTacticsState,
} from "@/types/tactics";
import type { TeamSport } from "@/types/team";
import { createQuarterOptions } from "../matches/match-quarter";

const futsalFormationNames = Object.keys(
  futsalFormationTemplates,
) as FormationName[];

const soccerFormationNames = (
  Object.keys(formationTemplate) as FormationName[]
).filter((formation) => !futsalFormationNames.includes(formation));

export function getMatchFormationOptions(
  sport: TeamSport,
  playersPerSide: MatchPlayersPerSide,
) {
  const formationNames =
    sport === "futsal" ? futsalFormationNames : soccerFormationNames;

  return formationNames.filter(
    (formation) => formationTemplate[formation].length === playersPerSide,
  );
}

export const createDefaultQuarterTactics = (
  sport: TeamSport = "soccer",
  playersPerSide: MatchPlayersPerSide = 11,
): QuarterTacticsState => {
  const [defaultFormation = "4-4-2"] = getMatchFormationOptions(
    sport,
    playersPerSide,
  );

  return {
    formation: defaultFormation,
    slots: formationTemplate[defaultFormation],
    cornerKickPlayerId: "",
    freeKickPlayerId: "",
    penaltyKickPlayerId: "",
  };
};

export const createDefaultMatchTacticsBySide = (
  sport: TeamSport = "soccer",
  playersPerSide: MatchPlayersPerSide = 11,
  quarterCount = 4,
): MatchTacticsBySide => ({
  our: createDefaultMatchTactics(sport, playersPerSide, quarterCount),
  team_a: createDefaultMatchTactics(sport, playersPerSide, quarterCount),
  team_b: createDefaultMatchTactics(sport, playersPerSide, quarterCount),
});

export const createDefaultMatchTactics = (
  sport: TeamSport = "soccer",
  playersPerSide: MatchPlayersPerSide = 11,
  quarterCount = 4,
): MatchTacticsByQuarter => {
  const quarterOptions = createQuarterOptions(quarterCount);

  return Object.fromEntries(
    quarterOptions.map((quarter) => [
      quarter,
      createDefaultQuarterTactics(sport, playersPerSide),
    ]),
  ) as MatchTacticsByQuarter;
};

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

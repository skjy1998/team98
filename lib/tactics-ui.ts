import { PlayerType } from "@/types/player";
import { FormationSlot } from "@/types/tactics";

export function normalizeSlotLabel(label?: string) {
  if (!label) return "";

  const normalizedMap: Record<string, string> = {
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
  return normalizedMap[label] ?? label;
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
      isRecommended: player.detailPositions?.includes(targetPosition) ?? false,
    }))
    .sort((a, b) => {
      if (a.isRecommended !== b.isRecommended) {
        return a.isRecommended ? -1 : 1;
      }
      return a.name.localeCompare(b.name, "ko");
    });
}

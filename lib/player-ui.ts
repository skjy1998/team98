import { PlayerDetailPosition } from "@/types/player";

export function getMainPositionFromDetail(
  detailPositions?: PlayerDetailPosition[],
): string | undefined {
  const first = detailPositions?.[0];

  if (!first) return undefined;

  if (first === "GK") return "GK";
  if (first === "CB" || first === "LB" || first === "RB") return "DF";
  if (first === "CDM" || first === "CM" || first === "CAM") return "MF";
  if (first === "ST" || first === "LW" || first === "RW") return "FW";

  return undefined;
}

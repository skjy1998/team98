export function getMainPositionFromDetail(
  detailPositions?: string[],
): string | undefined {
  const first = detailPositions?.[0];

  if (!first) return undefined;

  if (["ST", "LW", "RW"].includes(first)) return "FW";
  if (["CAM", "CM", "CDM"].includes(first)) return "MF";
  if (["CB", "LB", "RB"].includes(first)) return "DF";
  if (first === "GK") return "GK";

  return undefined;
}

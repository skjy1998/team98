// 배지와 포지션 표시 스타일

import { PlayerDetailPosition, PlayerType } from "@/types/player";

export function getMainPositionFromDetail(
  detailPositions?: PlayerDetailPosition[],
) {
  if (!detailPositions || detailPositions.length === 0) {
    return undefined;
  }

  const hasGK = detailPositions.includes("GK");
  if (hasGK) return "GK";

  const hasDF = detailPositions.some((position) =>
    ["CB", "LB", "RB"].includes(position),
  );
  if (hasDF) return "DF";

  const hasMF = detailPositions.some((position) =>
    ["CDM", "CM", "CAM"].includes(position),
  );
  if (hasMF) return "MF";

  const hasFW = detailPositions.some((position) =>
    ["LW", "RW", "ST"].includes(position),
  );
  if (hasFW) return "FW";

  return undefined;
}

export function getPositionBadgeClassName(position?: PlayerType["position"]) {
  switch (position) {
    case "GK":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "DF":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "MF":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "FW":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-stone-200 bg-stone-50 text-stone-500";
  }
}

export function getPlayerBadges(player: PlayerType) {
  const badges: { label: string; className: string }[] = [];

  if (!player.userId) {
    badges.push({
      label: "미가입",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    });
  }

  if (player.teamMemberRole === "owner") {
    badges.push({
      label: "회장",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    });
  }

  if (player.teamMemberRole === "staff") {
    badges.push({
      label: "운영진",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    });
  }

  if (player.role === "captain") {
    badges.push({
      label: "주장",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    });
  }

  if (player.role === "viceCaptain") {
    badges.push({
      label: "부주장",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    });
  }

  return badges;
}

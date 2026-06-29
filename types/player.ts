export const playerPositions = ["FW", "MF", "DF", "GK"] as const;

export const playerDetailPositions = {
  FW: ["ST", "LW", "RW"],
  MF: ["CAM", "CM", "CDM"],
  DF: ["CB", "LB", "RB"],
  GK: ["GK"],
} as const;

export type PlayerDetailPositionGroup = keyof typeof playerDetailPositions;

export type PlayerDetailPosition =
  (typeof playerDetailPositions)[PlayerDetailPositionGroup][number];

export interface PlayerType {
  id: string;
  name: string;
  position?: string;
  detailPositions?: PlayerDetailPosition[];
  number?: number;
  birth?: string;
  appearance: number;
  goal: number;
  assist: number;
}

export type PlayerSortType = "latest" | "number" | "name" | "position";

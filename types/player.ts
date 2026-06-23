export interface PlayerType {
  id: string;
  name: string;
  position?: string;
  detailPositions?: string[];
  number?: number;
  birth?: string;
  appearance: number;
  goal: number;
  assist: number;
}

export const playerPositions = ["FW", "MF", "DF", "GK"] as const;

export const playerDetailPositions = {
  FW: ["ST", "LW", "RW"],
  MF: ["CAM", "CM", "CDM"],
  DF: ["CB", "LB", "RB"],
  GK: ["GK"],
} as const;

export type PlayerSortType = "latest" | "number" | "name" | "position";

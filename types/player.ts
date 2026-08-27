export const playerPositions = ["FW", "MF", "DF", "GK"] as const;
export const playerDetailPositions = {
  FW: ["ST", "LW", "RW"],
  MF: ["CAM", "CM", "CDM"],
  DF: ["CB", "LB", "RB"],
  GK: ["GK"],
} as const;

export const playerPreferredFeet = ["right", "left", "both"] as const;
export const playerRoles = ["member", "captain", "viceCaptain"] as const;
export const teamMemberRoles = ["owner", "staff", "member"] as const;

export type PlayerPosition = (typeof playerPositions)[number];
export type PlayerDetailPositionGroup = keyof typeof playerDetailPositions;
export type PlayerPreferredFoot = (typeof playerPreferredFeet)[number];
export type PlayerDetailPosition =
  (typeof playerDetailPositions)[PlayerDetailPositionGroup][number];
export type PlayerRole = (typeof playerRoles)[number];
export type TeamMemberRole = (typeof teamMemberRoles)[number];
export type PlayerSortType = "latest" | "number" | "name" | "position";

export interface PlayerBase {
  id: string;
  userId?: string;
  name: string;
  position?: PlayerPosition;
  detailPositions?: PlayerDetailPosition[];
  number?: number;
  birth?: string;
  role?: PlayerRole;
  preferredFoot?: PlayerPreferredFoot;
  note?: string;
}

export interface PlayerStats {
  appearance: number;
  goal: number;
  assist: number;
}

export interface PlayerType extends PlayerBase, PlayerStats {
  teamMemberRole?: TeamMemberRole;
}

export interface ConnectableTeamMember {
  userId: string;
  label: string;
  role: TeamMemberRole;
}

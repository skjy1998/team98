import type { TeamMemberRole } from "./player";

export const teamSports = ["soccer", "futsal"] as const;

export type TeamSport = (typeof teamSports)[number];

export type TeamEntryMode = "create" | "join";

export interface CurrentTeam {
  id: string;
  name: string;
  sport: TeamSport;
  inviteCode: string;
  memberRole: TeamMemberRole;
}

export interface TeamSettingsSummary {
  playerCount: number;
  accountCount: number;
  unlinkedPlayerCount: number;
}

export const teamSports = ["soccer", "futsal"] as const;

export type TeamSport = (typeof teamSports)[number];

export interface CurrentTeam {
  id: string;
  name: string;
  sport: TeamSport;
  inviteCode: string;
}

export interface TeamSettingsSummary {
  playerCount: number;
  accountCount: number;
  unlinkedPlayerCount: number;
}

export type MatchStatus = "scheduled" | "canceled";
export type MatchType = "정규" | "자체전";
export type MatchUniform = "home" | "away";
export type MatchRecordEventType = "goal" | "concede";
export type MatchRecordQuarter = "1Q" | "2Q" | "3Q" | "4Q" | "unknown";
export type MatchRecordMap = Record<string, MatchRecordEvent[]>;
export type MatchDetailTab =
  | "info"
  | "vote"
  | "attendance"
  | "tactics"
  | "record";

export type MatchOpponentRecordResult = "win" | "draw" | "lose";

export interface MatchRecordEvent {
  id: string;
  type: MatchRecordEventType;
  playerId?: string;
  playerName?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  minute?: string;
  quarter?: MatchRecordQuarter;
}

export interface MatchCreateFormValue {
  title: string;
  type: MatchType;
  date: string;
  startTime: string;
  endTime: string;
  voteDeadline: string;
  opponent?: string;
  location: string;
  uniform: MatchUniform;
}

export interface MatchItem {
  id: string;
  title: string;
  type: MatchType;
  date: string;
  startTime: string;
  endTime: string;
  voteDeadline: string;
  location?: string;
  opponent?: string;
  uniform: MatchUniform;
  status: MatchStatus;
  ourScore?: number;
  opponentScore?: number;
  isUpcoming: boolean;
}

export interface MatchOpponentRecordItem {
  id: string;
  date: string;
  ourScore: number;
  opponentScore: number;
  result: MatchOpponentRecordResult;
}

export interface MatchOpponentRecordSummary {
  totalMatches: number;
  win: number;
  draw: number;
  lose: number;
  goals: number;
  conceded: number;
  goalDiff: number;
  winRate: number;
  recentMatches: MatchOpponentRecordItem[];
}

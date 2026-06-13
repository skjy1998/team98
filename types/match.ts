export type MatchStatus = "scheduled" | "canceled";
export type MatchType = "정규" | "자체전";
export type MatchUniform = "home" | "away";
export type MatchRecordEventType = "goal" | "concede";
export type MatchRecordQuarter = "1Q" | "2Q" | "3Q" | "4Q" | "unknown";

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

export type MatchRecordMap = Record<string, MatchRecordEvent[]>;

export interface MatchCreateFormValue {
  title: string;
  type: MatchType;
  date: string;
  startTime: string;
  endTime: string;
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
  location?: string;
  opponent?: string;
  status: MatchStatus;
  ourScore?: number;
  opponentScore?: number;
  isUpcoming: boolean;
}

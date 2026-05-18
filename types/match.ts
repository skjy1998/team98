export interface MatchEvent {
  id: string;
  minute: string;
  type: "goal" | "yellow" | "red" | "substitution";
  playerName: string;
  detail?: string;
}

export interface MatchType {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  venue: "홈" | "원정";
  status: "예정" | "종료";
  ourScore?: number;
  opponentScore?: number;
  events: MatchEvent[];
}
export type MatchTab = "기록" | "라인업" | "통계";

export type MatchStatus = "scheduled" | "win" | "lose" | "draw" | "canceled";
export type MatchType = "정규" | "연습" | "자체전";

export interface MatchItem {
  id: string;
  title: string;
  type: MatchType;
  date: string;
  time: string;
  location: string;
  status: MatchStatus;
  score?: string;
  isUpcoming: boolean;
}

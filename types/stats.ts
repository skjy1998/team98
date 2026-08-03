import type { MatchAttendanceStatus } from "./match-attendance";

export type StatsTab = "me" | "team" | "ranking";
export type RecentResult = "win" | "draw" | "lose";
export type StatsSortKey =
  | "attackPoint"
  | "goal"
  | "assist"
  | "appearance"
  | "attendanceRate";

export interface RankingPlayer {
  id: string;
  name: string;
  goal: number;
  assist: number;
  appearance: number;
  appearanceStreak: number;
}

export interface RankingItem {
  id: string;
  name: string;
  value: number;
}

export interface StatsPlayerRow {
  id: string;
  name: string;
  number?: number;
  attackPoint: number;
  goal: number;
  assist: number;
  appearance: number;
  attendanceRate: number;
}

export interface TeamSummary {
  total: number;
  win: number;
  draw: number;
  lose: number;
  goals: number;
  conceded: number;
  winRate: number;
  goalDiff: number;
}

export interface PlayerRecentMatch {
  id: string;
  title: string;
  date: string;
  attendanceStatus: MatchAttendanceStatus | "unchecked";
  goal: number;
  assist: number;
}

export interface TeamHighlightMatch {
  id: string;
  title: string;
  goals: number;
  conceded: number;
}

export interface TeamHighlights {
  highestScoringMatch: TeamHighlightMatch | null;
  biggestWin: TeamHighlightMatch | null;
  cleanSheetCount: number;
  currentUnbeatenStreak: number;
}

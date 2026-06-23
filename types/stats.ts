export type RecentResult = "win" | "draw" | "lose";

export interface RankingPlayer {
  id: string;
  name: string;
  goal: number;
  assist: number;
  appearance: number;
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

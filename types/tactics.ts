import type { SelfMatchSide } from "./match";

export interface FormationSlot {
  id: string;
  label: string;
  x: number;
  y: number;
  playerId?: string;
}

export type FutsalFormationName =
  | "1-1" // 3대3
  | "2-1" // 4대4
  | "1-2" // 4대4
  | "2-2" // 5대5
  | "1-2-1" // 5대5
  | "2-2-1" // 6대6
  | "2-1-2" // 6대6
  | "2-3-1" // 7대7
  | "3-2-1" // 7대7
  | "3-1-2"; // 7대7

export type FormationName =
  | FutsalFormationName
  | "4-4-2"
  | "4-3-3"
  | "4-2-3-1"
  | "3-5-2"
  | "3-4-3"
  | "4-1-4-1"
  | "4-5-1"
  | "4-3-1-2"
  | "3-4-1-2"
  | "5-3-2"
  | "5-4-1";

export type SetPieceKey =
  | "cornerKickPlayerId"
  | "freeKickPlayerId"
  | "penaltyKickPlayerId";

export interface SavedFormation {
  formation: FormationName;
  slots: FormationSlot[];
  cornerKickPlayerId?: string;
  freeKickPlayerId?: string;
  penaltyKickPlayerId?: string;
}

export type MatchQuarter = `${number}Q`;

export type MatchTacticsSide = "our" | SelfMatchSide;

export interface QuarterTacticsState {
  formation: FormationName;
  slots: FormationSlot[];
  cornerKickPlayerId?: string;
  freeKickPlayerId?: string;
  penaltyKickPlayerId?: string;
}

export type MatchTacticsByQuarter = Record<MatchQuarter, QuarterTacticsState>;

export type MatchTacticsBySide = Record<
  MatchTacticsSide,
  MatchTacticsByQuarter
>;

// 저장해 둔 전술 목록
export interface SaveTacticPreset {
  id: string;
  name: string;
  formation: FormationName;
  slots: FormationSlot[];
  cornerKickPlayerId?: string;
  freeKickPlayerId?: string;
  penaltyKickPlayerId?: string;
  saveAt: string;
}

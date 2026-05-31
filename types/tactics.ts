export interface FormationSlot {
  id: string;
  label: string;
  x: number;
  y: number;
  playerId?: string;
}

export type FormationName =
  | "4-4-2"
  | "4-3-3"
  | "4-2-3-1"
  | "3-5-2"
  | "3-4-3"
  | "4-1-4-1";

export interface SavedFormation {
  formation: FormationName;
  slots: FormationSlot[];
  cornerKickPlayerId?: string;
  freeKickPlayerId?: string;
  penaltyKickPlayerId?: string;
}

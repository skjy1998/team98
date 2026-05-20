export interface FormationSlot {
  id: string;
  label: string;
  x: number;
  y: number;
  playerId?: string;
}

export type FormationName = "4-4-2" | "4-3-3";

export interface SavedFormation {
  formation: FormationName;
  slots: FormationSlot[];
}

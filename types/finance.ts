export type FinanceEntryType = "income" | "expense";
export type FinanceTab = "transactions" | "payments" | "fines" | "settings";
export type FinanceEntryFilter = "all" | FinanceEntryType;
export type FinanceEntryCategory = "fee" | "fine" | "etc";
export type FineRuleTrigger = "late" | "absence" | "noshow" | "etc";
export type FineChargeStatus = "unpaid" | "paid";

export interface FinanceEntry {
  id: string;
  type: FinanceEntryType;
  amount: number;
  description: string;
  date: string;
  time: string;
  category?: FinanceEntryCategory;
  playerId?: string;
  matchId?: string;
}

export interface PaymentStatusRow {
  playerId: string;
  playerName: string;
  status: "paid" | "unpaid";
  paidAt: string;
}

export interface PaymentSummary {
  paidCount: number;
  unpaidCount: number;
  paidRate: number;
}

export interface FeeType {
  id: string;
  name: string;
  description: string;
  amount: number;
}

export interface FineRule {
  id: string;
  name: string;
  trigger: FineRuleTrigger;
  amount: number;
}

export interface FineCharge {
  id: string;
  matchId?: string;
  playerId: string;
  ruleId: string;
  ruleName: string;
  trigger: FineRuleTrigger;
  amount: number;
  description: string;
  status: FineChargeStatus;
  paidEntryId?: string;
  chargedAt: string;
  paidAt?: string;
}

export interface CreateFineChargeInput {
  matchId?: string;
  playerId: string;
  ruleId: string;
  ruleName: string;
  trigger: FineRuleTrigger;
  amount: number;
  description: string;
}

export interface FinanceEntryFormProps {
  entryType: FinanceEntryType;
  onChangeEntryType: (value: FinanceEntryType) => void;
  entryAmount: string;
  onChangeEntryAmount: (value: string) => void;
  entryDescription: string;
  onChangeEntryDescription: (value: string) => void;
  entryDate: string;
  onChangeEntryDate: (value: string) => void;
  entryTime: string;
  onChangeEntryTime: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  onCancel?: () => void;
  className?: string;
}

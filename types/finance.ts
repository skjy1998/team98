export type FinanceEntryType = "income" | "expense";
export type FinanceTab = "transactions" | "payments" | "settings";
export type FinanceEntryFilter = "all" | FinanceEntryType;

export interface FinanceEntry {
  id: string;
  type: FinanceEntryType;
  amount: number;
  description: string;
  date: string;
  time: string;
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
  trigger: string;
  amount: number;
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

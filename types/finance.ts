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

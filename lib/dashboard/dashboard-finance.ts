import type { FinanceEntry } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import { getFinanceSummary } from "../finance/finance";
import {
  getMonthlyPaymentEntries,
  getPaymentStatusRows,
  getPaymentSummary,
} from "../finance/finance-payment";

interface GetDashboardFinanceDataParams {
  entries: FinanceEntry[];
  players: PlayerType[];
  currentMonth: string;
}

export function getDashboardFinanceData({
  entries,
  players,
  currentMonth,
}: GetDashboardFinanceDataParams) {
  const monthlyPaymentEntries = getMonthlyPaymentEntries(entries, currentMonth);

  const paymentStatusRows = getPaymentStatusRows(
    players,
    monthlyPaymentEntries,
  );

  return {
    financeSummary: getFinanceSummary(entries, currentMonth),
    paymentStatusRows,
    paymentSummary: getPaymentSummary(paymentStatusRows),
  };
}

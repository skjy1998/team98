import type { FinanceEntry } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import {
  getFinanceSummary,
  getMonthlyPaymentEntries,
  getPaymentStatusRows,
  getPaymentSummary,
} from "../finance/finance";

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

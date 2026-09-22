import type { FeeType, FinanceEntry } from "@/types/finance";
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
  feeTypes: FeeType[];
}

export function getDashboardFinanceData({
  entries,
  players,
  currentMonth,
  feeTypes,
}: GetDashboardFinanceDataParams) {
  const monthlyPaymentEntries = getMonthlyPaymentEntries(entries, currentMonth);

  const paymentStatusRows = getPaymentStatusRows(
    players,
    monthlyPaymentEntries,
    feeTypes,
  );

  return {
    financeSummary: getFinanceSummary(entries, currentMonth),
    paymentStatusRows,
    paymentSummary: getPaymentSummary(paymentStatusRows),
  };
}

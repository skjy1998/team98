import {
  getCurrentMonthLabel,
  getMonthlyPaymentEntries,
  getPaymentRowsByStatus,
  getPaymentStatusRows,
  getPaymentSummary,
} from "@/lib/finance/finance-payment";
import type { FeeType, FinanceEntry } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import { useMemo } from "react";

interface UseFinancePaymentViewDataParams {
  entries: FinanceEntry[];
  players: PlayerType[];
  currentMonth: string;
  feeTypes: FeeType[];
}

export function useFinancePaymentViewData({
  entries,
  players,
  currentMonth,
  feeTypes,
}: UseFinancePaymentViewDataParams) {
  const currentMonthLabel = useMemo(
    () => getCurrentMonthLabel(currentMonth),
    [currentMonth],
  );

  const monthlyPaymentEntries = useMemo(
    () => getMonthlyPaymentEntries(entries, currentMonth),
    [entries, currentMonth],
  );

  const paymentStatusRows = useMemo(
    () => getPaymentStatusRows(players, monthlyPaymentEntries, feeTypes),
    [players, monthlyPaymentEntries, feeTypes],
  );

  const paymentSummary = useMemo(
    () => getPaymentSummary(paymentStatusRows),
    [paymentStatusRows],
  );

  const unpaidPaymentRows = useMemo(
    () =>
      paymentStatusRows.filter(
        (row) => row.status === "unpaid" && row.isFeeConfigured,
      ),
    [paymentStatusRows],
  );

  const unconfiguredPaymentRows = useMemo(
    () =>
      paymentStatusRows.filter(
        (row) => row.status === "unpaid" && !row.isFeeConfigured,
      ),
    [paymentStatusRows],
  );

  const paidPaymentRows = useMemo(
    () => getPaymentRowsByStatus(paymentStatusRows, "paid"),
    [paymentStatusRows],
  );

  return {
    currentMonthLabel,
    monthlyPaymentEntries,
    paymentSummary,
    unpaidPaymentRows,
    unconfiguredPaymentRows,
    paidPaymentRows,
  };
}

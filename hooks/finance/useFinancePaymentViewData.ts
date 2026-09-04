import {
  getCurrentMonthLabel,
  getMonthlyPaymentEntries,
  getPaymentRowsByStatus,
  getPaymentStatusRows,
  getPaymentSummary,
} from "@/lib/finance/finance-payment";
import type { FinanceEntry } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import { useMemo } from "react";

interface UseFinancePaymentViewDataParams {
  entries: FinanceEntry[];
  players: PlayerType[];
  currentMonth: string;
}

export function useFinancePaymentViewData({
  entries,
  players,
  currentMonth,
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
    () => getPaymentStatusRows(players, monthlyPaymentEntries),
    [players, monthlyPaymentEntries],
  );

  const paymentSummary = useMemo(
    () => getPaymentSummary(paymentStatusRows),
    [paymentStatusRows],
  );

  const unpaidPaymentRows = useMemo(
    () => getPaymentRowsByStatus(paymentStatusRows, "unpaid"),
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
    paidPaymentRows,
  };
}

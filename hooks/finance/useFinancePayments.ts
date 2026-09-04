import {
  createMonthlyFeeEntry,
  getAdjacentFinanceMonth,
} from "@/lib/finance/finance-payment";
import type { FinanceEntry, PaymentStatusRow } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import { useState } from "react";
import { useFinancePaymentViewData } from "./useFinancePaymentViewData";

interface UseFinancePaymentsParams {
  entries: FinanceEntry[];
  players: PlayerType[];
  defaultMonth: string;
  primaryFeeAmount: number;
  addEntry: (entry: Omit<FinanceEntry, "id">) => Promise<boolean>;
  deleteEntry: (entryId: string) => Promise<boolean>;
}

export function useFinancePayments({
  entries,
  players,
  defaultMonth,
  primaryFeeAmount,
  addEntry,
  deleteEntry,
}: UseFinancePaymentsParams) {
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const [isUnpaidOpen, setIsUnpaidOpen] = useState(false);
  const [isPaidOpen, setIsPaidOpen] = useState(false);

  const {
    currentMonthLabel,
    monthlyPaymentEntries,
    paymentSummary,
    unpaidPaymentRows,
    paidPaymentRows,
  } = useFinancePaymentViewData({
    entries,
    players,
    currentMonth,
  });

  const handleMoveMonth = (direction: "prev" | "next") => {
    setCurrentMonth((month) => getAdjacentFinanceMonth(month, direction));
  };

  const handleToggleUnpaid = () => {
    setIsUnpaidOpen((prev) => !prev);
  };

  const handleTogglePaid = () => {
    setIsPaidOpen((prev) => !prev);
  };

  const handleChangePaymentStatus = async (
    playerId: string,
    playerName: string,
    nextStatus: PaymentStatusRow["status"],
  ) => {
    const existingPaymentEntry = monthlyPaymentEntries.find(
      (entry) => entry.category === "fee" && entry.playerId === playerId,
    );

    if (nextStatus === "paid" && !existingPaymentEntry) {
      const success = await addEntry(
        createMonthlyFeeEntry(
          currentMonth,
          playerId,
          playerName,
          primaryFeeAmount,
        ),
      );

      if (!success) {
        return false;
      }

      return true;
    }

    if (nextStatus === "unpaid" && existingPaymentEntry) {
      const success = await deleteEntry(existingPaymentEntry.id);

      if (!success) {
        return false;
      }

      return true;
    }

    return true;
  };

  const handleBulkMarkPaid = async (
    playersToMark: Array<{ playerId: string; playerName: string }>,
  ) => {
    for (const player of playersToMark) {
      const success = await handleChangePaymentStatus(
        player.playerId,
        player.playerName,
        "paid",
      );

      if (!success) {
        return false;
      }
    }

    return true;
  };

  return {
    currentMonth,
    currentMonthLabel,
    paymentSummary,
    unpaidPaymentRows,
    paidPaymentRows,
    isUnpaidOpen,
    isPaidOpen,
    handleMoveMonth,
    handleToggleUnpaid,
    handleTogglePaid,
    handleChangePaymentStatus,
    handleBulkMarkPaid,
  };
}

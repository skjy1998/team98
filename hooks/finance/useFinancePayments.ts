import {
  createMonthlyFeeEntry,
  getAdjacentFinanceMonth,
} from "@/lib/finance/finance-payment";
import type { FeeType, FinanceEntry, PaymentStatusRow } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import { useState } from "react";
import { useFinancePaymentViewData } from "./useFinancePaymentViewData";

interface UseFinancePaymentsParams {
  entries: FinanceEntry[];
  players: PlayerType[];
  defaultMonth: string;
  feeTypes: FeeType[];
  addEntry: (entry: Omit<FinanceEntry, "id">) => Promise<boolean>;
  deleteEntry: (entryId: string) => Promise<boolean>;
}

export function useFinancePayments({
  entries,
  players,
  defaultMonth,
  feeTypes,
  addEntry,
  deleteEntry,
}: UseFinancePaymentsParams) {
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const [isUnpaidOpen, setIsUnpaidOpen] = useState(false);
  const [isPaidOpen, setIsPaidOpen] = useState(false);
  const [isUnconfiguredOpen, setIsUnconfiguredOpen] = useState(false);

  const {
    currentMonthLabel,
    monthlyPaymentEntries,
    paymentSummary,
    unpaidPaymentRows,
    unconfiguredPaymentRows,
    paidPaymentRows,
  } = useFinancePaymentViewData({
    entries,
    players,
    currentMonth,
    feeTypes,
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

  const handleToggleUnconfigured = () => {
    setIsUnconfiguredOpen((prev) => !prev);
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
      const player = players.find((item) => item.id === playerId);
      const feeType = feeTypes.find((item) => item.id === player?.feeTypeId);

      if (!feeType) {
        return false;
      }

      const success = await addEntry(
        createMonthlyFeeEntry(currentMonth, playerId, playerName, feeType),
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
    unconfiguredPaymentRows,
    isUnpaidOpen,
    isPaidOpen,
    isUnconfiguredOpen,
    handleMoveMonth,
    handleToggleUnpaid,
    handleTogglePaid,
    handleToggleUnconfigured,
    handleChangePaymentStatus,
    handleBulkMarkPaid,
  };
}

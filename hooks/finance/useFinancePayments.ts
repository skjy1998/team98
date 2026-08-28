import {
  createMonthlyFeeEntry,
  getAdjacentFinanceMonth,
  getCurrentMonthLabel,
  getMonthlyPaymentEntries,
  getPaymentRowsByStatus,
  getPaymentStatusRows,
  getPaymentSummary,
} from "@/lib/finance/finance-payment";
import type { FinanceEntry, PaymentStatusRow } from "@/types/finance";
import type { PlayerType } from "@/types/player";
import { useMemo, useState } from "react";

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

  // 화면용 월 문자열
  const currentMonthLabel = useMemo(
    () => getCurrentMonthLabel(currentMonth),
    [currentMonth],
  );

  // 이번 달 회비 납부 기록 목록
  const monthlyPaymentEntries = useMemo(
    () => getMonthlyPaymentEntries(entries, currentMonth),
    [entries, currentMonth],
  );

  // 선수 별 납부 상태 status === paid 면 납부완료
  const paymentStatusRows = useMemo(
    () => getPaymentStatusRows(players, monthlyPaymentEntries),
    [players, monthlyPaymentEntries],
  );

  // 통계값 만들기
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

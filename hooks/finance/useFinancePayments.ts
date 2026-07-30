import {
  getCurrentMonthLabel,
  getMonthlyPaymentEntries,
  getPaymentStatusRows,
  getPaymentSummary,
} from "@/lib/finance/finance";
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
    () => paymentStatusRows.filter((row) => row.status === "unpaid"),
    [paymentStatusRows],
  );

  const paidPaymentRows = useMemo(
    () => paymentStatusRows.filter((row) => row.status === "paid"),
    [paymentStatusRows],
  );

  const handleMoveMonth = (direction: "prev" | "next") => {
    const [year, month] = currentMonth.split("-").map(Number);

    const nextDate =
      direction === "prev"
        ? new Date(year, month - 2, 1)
        : new Date(year, month, 1);
    const nextYear = nextDate.getFullYear();
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, "0");

    setCurrentMonth(`${nextYear}-${nextMonth}`);
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
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      const success = await addEntry({
        type: "income",
        amount: primaryFeeAmount,
        description: `${currentMonth} 회비 (${playerName})`,
        date: `${currentMonth}-01`,
        time: currentTime,
        category: "fee",
        playerId,
      });

      if (!success) {
        globalThis.alert("납부 상태 변경에 실패했어요.");
        return false;
      }

      return true;
    }

    if (nextStatus === "unpaid" && existingPaymentEntry) {
      const success = await deleteEntry(existingPaymentEntry.id);

      if (!success) {
        globalThis.alert("납부 상태 변경에 실패했어요.");
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

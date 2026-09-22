import type {
  FeeType,
  FinanceEntry,
  PaymentStatusRow,
  PaymentSummary,
} from "@/types/finance";
import type { PlayerType } from "@/types/player";

export function getCurrentMonthLabel(currentMonth: string) {
  const [year, month] = currentMonth.split("-");

  return `${year}년 ${Number(month)}월`;
}

export function getAdjacentFinanceMonth(
  currentMonth: string,
  direction: "prev" | "next",
) {
  const [year, month] = currentMonth.split("-").map(Number);

  const nextDate =
    direction === "prev"
      ? new Date(year, month - 2, 1)
      : new Date(year, month, 1);

  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

export function getMonthlyPaymentEntries(
  entries: FinanceEntry[],
  currentMonth: string,
) {
  return entries.filter(
    (entry) =>
      entry.date.startsWith(currentMonth) &&
      entry.type === "income" &&
      entry.category === "fee",
  );
}

export function getPaymentStatusRows(
  players: PlayerType[],
  monthlyPaymentEntries: FinanceEntry[],
  feeTypes: FeeType[],
): PaymentStatusRow[] {
  return players.map((player) => {
    const paymentEntry = monthlyPaymentEntries.find(
      (entry) => entry.playerId === player.id,
    );
    const assignedFeeType = feeTypes.find(
      (feeType) => feeType.id === player.feeTypeId,
    );

    return {
      playerId: player.id,
      playerName: player.name,
      status: paymentEntry ? "paid" : "unpaid",
      paidAt: paymentEntry
        ? `${Number(paymentEntry.date.slice(5, 7))}월 ${Number(
            paymentEntry.date.slice(8, 10),
          )}일`
        : "",
      feeTypeName: paymentEntry?.feeTypeName ?? assignedFeeType?.name,
      feeAmount: paymentEntry?.amount ?? assignedFeeType?.amount,
      isFeeConfigured: Boolean(assignedFeeType),
    };
  });
}

export function getPaymentSummary(
  paymentStatusRows: PaymentStatusRow[],
): PaymentSummary {
  const payableRows = paymentStatusRows.filter(
    (row) => row.isFeeConfigured || row.status === "paid",
  );
  const paidCount = payableRows.filter((row) => row.status === "paid").length;
  const unpaidCount = payableRows.length - paidCount;

  return {
    paidCount,
    unpaidCount,
    paidRate:
      payableRows.length > 0
        ? Math.round((paidCount / payableRows.length) * 100)
        : 0,
  };
}

export function getPaymentRowsByStatus(
  rows: PaymentStatusRow[],
  status: PaymentStatusRow["status"],
) {
  return rows.filter((row) => row.status === status);
}

export function createMonthlyFeeEntry(
  currentMonth: string,
  playerId: string,
  playerName: string,
  feeType: FeeType,
  now = new Date(),
): Omit<FinanceEntry, "id"> {
  return {
    type: "income",
    amount: feeType.amount,
    description: `${playerName} ${Number(currentMonth.slice(5))}월 ${feeType.name}`,
    date: `${currentMonth}-01`,
    time: now.toTimeString().slice(0, 5),
    category: "fee",
    playerId,
    feeTypeId: feeType.id,
    feeTypeName: feeType.name,
  };
}

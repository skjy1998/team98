import type {
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
): PaymentStatusRow[] {
  return players.map((player) => {
    const paymentEntry = monthlyPaymentEntries.find(
      (entry) => entry.playerId === player.id,
    );

    return {
      playerId: player.id,
      playerName: player.name,
      status: paymentEntry ? "paid" : "unpaid",
      paidAt: paymentEntry ? `${paymentEntry.date} · ${paymentEntry.time}` : "",
    };
  });
}

export function getPaymentSummary(
  PaymentStatusRows: PaymentStatusRow[],
): PaymentSummary {
  const paidCount = PaymentStatusRows.filter(
    (row) => row.status === "paid",
  ).length;

  const unpaidCount = PaymentStatusRows.length - paidCount;

  return {
    paidCount,
    unpaidCount,
    paidRate:
      PaymentStatusRows.length > 0
        ? Math.round((paidCount / PaymentStatusRows.length) * 100)
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
  amount: number,
  now = new Date(),
): Omit<FinanceEntry, "id"> {
  return {
    type: "income",
    amount,
    description: `${currentMonth} 회비 (${playerName})`,
    date: `${currentMonth}-01`,
    time: now.toTimeString().slice(0, 5),
    category: "fee",
    playerId,
  };
}

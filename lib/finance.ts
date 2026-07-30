import {
  FeeType,
  FinanceEntry,
  FinanceTab,
  PaymentStatusRow,
  PaymentSummary,
} from "@/types/finance";
import { PlayerType } from "@/types/player";

export function getFinanceDefaults(date = new Date()) {
  const defaultMonth = `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`;

  const defaultDate = `${defaultMonth}-${String(date.getDate()).padStart(
    2,
    "0",
  )}`;

  const defaultTime = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

  return {
    defaultMonth,
    defaultDate,
    defaultTime,
  };
}

export function getCurrentMonthLabel(currentMonth: string) {
  const [year, month] = currentMonth.split("-");
  return `${year}년 ${Number(month)}월`;
}

export function getFinanceSummary(entries: FinanceEntry[], thisMonth: string) {
  const currentMonthEntries = entries.filter((entry) =>
    entry.date.startsWith(thisMonth),
  );

  const totalIncome = currentMonthEntries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpense = currentMonthEntries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalBalance = entries.reduce((sum, entry) => {
    return entry.type === "income" ? sum + entry.amount : sum - entry.amount;
  }, 0);

  return {
    totalIncome,
    totalExpense,
    totalBalance,
  };
}

export function getMonthlyPaymentEntries(
  entries: FinanceEntry[],
  currentMonth: string,
) {
  return entries.filter((entry) => {
    const matchesMonth = entry.date.startsWith(currentMonth);
    const isIncome = entry.type === "income";
    const isFeePayment = entry.description.includes("회비");

    return matchesMonth && isIncome && isFeePayment;
  });
}

export function getPaymentStatusRows(
  players: PlayerType[],
  monthlyPaymentEntries: FinanceEntry[],
): PaymentStatusRow[] {
  return players.map((player) => {
    const paymentEntry = monthlyPaymentEntries.find(
      (entry) => entry.category === "fee" && entry.playerId === player.id,
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
  paymentStatusRow: PaymentStatusRow[],
): PaymentSummary {
  const paidCount = paymentStatusRow.filter(
    (row) => row.status === "paid",
  ).length;

  const unpaidCount = paymentStatusRow.filter(
    (row) => row.status === "unpaid",
  ).length;

  const paidRate =
    paymentStatusRow.length > 0
      ? Math.round((paidCount / paymentStatusRow.length) * 100)
      : 0;
  return {
    paidCount,
    unpaidCount,
    paidRate,
  };
}

export function getPrimaryFeeAmount(feeTypes: FeeType[]) {
  const monthlyFee = feeTypes.find((feeType) => {
    const name = feeType.name.replaceAll(" ", "");
    const description = feeType.description.replaceAll(" ", "");

    return (
      name === "월회비" ||
      description.includes("월회비") ||
      name.includes("일반")
    );
  });

  return monthlyFee?.amount ?? 0;
}

export function getFinanceTab(tab: string | null): FinanceTab {
  if (
    tab === "transactions" ||
    tab === "payments" ||
    tab === "fines" ||
    tab === "settings"
  ) {
    return tab;
  }

  return "transactions";
}

export function formatFinanceEntryDescription(description: string) {
  return description
    .replace("[late] ", "")
    .replace("[absence] ", "")
    .replace("[noshow] ", "")
    .replace("[etc] ", "");
}

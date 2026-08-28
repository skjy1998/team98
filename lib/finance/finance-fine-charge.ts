import type { FinanceEntry, FineCharge } from "@/types/finance";
import { getFinanceDefaults } from "./finance";

export function createFinePaymentEntry(
  charge: FineCharge,
  date = new Date(),
): Omit<FinanceEntry, "id"> {
  const { defaultDate, defaultTime } = getFinanceDefaults(date);

  return {
    type: "income",
    amount: charge.amount,
    description: charge.description,
    date: defaultDate,
    time: defaultTime,
    category: "fine",
    playerId: charge.playerId,
    matchId: charge.matchId,
  };
}

export function markFineChargePaidInList(
  fineCharges: FineCharge[],
  fineChargeId: string,
  paidEntryId: string,
  paidAt: string,
) {
  return fineCharges.map((charge) =>
    charge.id === fineChargeId
      ? {
          ...charge,
          status: "paid" as const,
          paidEntryId,
          paidAt,
        }
      : charge,
  );
}

export function markFineChargeUnpaidInList(
  fineCharges: FineCharge[],
  fineChargeId: string,
) {
  return fineCharges.map((charge) =>
    charge.id === fineChargeId
      ? {
          ...charge,
          status: "unpaid" as const,
          paidEntryId: undefined,
          paidAt: undefined,
        }
      : charge,
  );
}

import type { FineCharge } from "@/types/finance";

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

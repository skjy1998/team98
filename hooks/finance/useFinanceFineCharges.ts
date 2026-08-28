import type {
  CreateFineChargeInput,
  FinanceEntry,
  FineCharge,
  FineChargeStatus,
} from "@/types/finance";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import {
  createTeamFineCharges,
  deleteUnpaidTeamFineCharge,
  getTeamFineCharges,
  markTeamFineChargePaid,
  markTeamFineChargeUnpaid,
  restoreTeamFineChargePaid,
} from "@/lib/finance/finance-fine-charge-repository";
import {
  createFinePaymentEntry,
  markFineChargePaidInList,
  markFineChargeUnpaidInList,
} from "@/lib/finance/finance-fine-charge";

interface UseFinanceFineChargesParams {
  addEntryWithResult: (
    entry: Omit<FinanceEntry, "id">,
  ) => Promise<FinanceEntry | null>;
  deleteEntry: (entryId: string) => Promise<boolean>;
}

export function useFinanceFineCharges({
  addEntryWithResult,
  deleteEntry,
}: UseFinanceFineChargesParams) {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [fineCharges, setFineCharges] = useState<FineCharge[]>([]);
  const [fineChargesLoaded, setFineChargesLoaded] = useState(false);
  const [fineChargesError, setFineChargesError] = useState("");

  const loadFineCharges = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setFineCharges([]);
      setFineChargesLoaded(true);
      setFineChargesError("");
      return;
    }

    setFineChargesLoaded(false);
    setFineChargesError("");

    try {
      const nextFineCharges = await getTeamFineCharges(teamId);
      setFineCharges(nextFineCharges);
    } catch (error) {
      console.error("finance fine charges load error", error);
      setFineCharges([]);
      setFineChargesError("벌금 부과 내역을 불러오지 못했어요.");
    } finally {
      setFineChargesLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFineCharges();
  }, [loadFineCharges]);

  const createFineCharges = async (inputs: CreateFineChargeInput[]) => {
    if (!teamId || inputs.length === 0) return false;

    try {
      const createdCharges = await createTeamFineCharges(teamId, inputs);

      setFineCharges((current) => [...createdCharges, ...current]);
      return true;
    } catch (error) {
      console.error("finance fine charges create error", error);
      return false;
    }
  };

  const deleteFineCharge = async (fineChargeId: string) => {
    if (!teamId) return false;

    try {
      await deleteUnpaidTeamFineCharge(teamId, fineChargeId);

      setFineCharges((current) =>
        current.filter((charge) => charge.id !== fineChargeId),
      );

      return true;
    } catch (error) {
      console.error("finance fine charge delete error", error);
      return false;
    }
  };

  const markFineChargePaid = async (charge: FineCharge) => {
    if (!teamId || charge.status === "paid") return true;

    const now = new Date();
    const paidAt = now.toISOString();

    const createdEntry = await addEntryWithResult(
      createFinePaymentEntry(charge, now),
    );

    if (!createdEntry) return false;

    try {
      const updated = await markTeamFineChargePaid(
        teamId,
        charge.id,
        createdEntry.id,
        paidAt,
      );

      if (!updated) {
        await deleteEntry(createdEntry.id);
        return false;
      }
    } catch (error) {
      console.error("mark fine charge paid error", error);
      await deleteEntry(createdEntry.id);
      return false;
    }

    setFineCharges((current) =>
      markFineChargePaidInList(current, charge.id, createdEntry.id, paidAt),
    );

    return true;
  };

  const markFineChargeUnpaid = async (charge: FineCharge) => {
    if (!teamId || charge.status === "unpaid") return true;

    const previousPaidEntryId = charge.paidEntryId;
    const previousPaidAt = charge.paidAt;

    try {
      await markTeamFineChargeUnpaid(teamId, charge.id);
    } catch (error) {
      console.error("mark fine charge unpaid error", error);
      return false;
    }

    if (previousPaidEntryId) {
      const deleted = await deleteEntry(previousPaidEntryId);

      if (!deleted) {
        try {
          await restoreTeamFineChargePaid(
            teamId,
            charge.id,
            previousPaidEntryId,
            previousPaidAt,
          );
        } catch (error) {
          console.error("restore fine charge paid error", error);
        }

        return false;
      }
    }

    setFineCharges((current) => markFineChargeUnpaidInList(current, charge.id));

    return true;
  };

  const handleChangeFineChargeStatus = async (
    charge: FineCharge,
    nextStatus: FineChargeStatus,
  ) => {
    return nextStatus === "paid"
      ? markFineChargePaid(charge)
      : markFineChargeUnpaid(charge);
  };

  return {
    fineCharges,
    fineChargesLoaded,
    fineChargesError,
    createFineCharges,
    deleteFineCharge,
    handleChangeFineChargeStatus,
    reloadFineCharges: loadFineCharges,
  };
}

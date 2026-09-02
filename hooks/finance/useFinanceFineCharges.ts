import type {
  CreateFineChargeInput,
  FineCharge,
  FineChargeStatus,
} from "@/types/finance";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import {
  createTeamFineCharges,
  deleteUnpaidTeamFineCharge,
  getTeamFineCharges,
  payTeamFineCharge,
  unpayTeamFineCharge,
} from "@/lib/finance/finance-fine-charge-repository";
import {
  markFineChargePaidInList,
  markFineChargeUnpaidInList,
} from "@/lib/finance/finance-fine-charge";

interface UseFinanceFineChargesParams {
  reloadEntries: () => Promise<void>;
}

export function useFinanceFineCharges({
  reloadEntries,
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
      const deleted = await deleteUnpaidTeamFineCharge(teamId, fineChargeId);

      if (!deleted) return false;

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

    const paidAt = new Date().toISOString();

    try {
      const result = await payTeamFineCharge(teamId, charge.id, paidAt);

      setFineCharges((current) =>
        markFineChargePaidInList(
          current,
          charge.id,
          result.paid_entry_id,
          result.paid_at,
        ),
      );

      await reloadEntries();
      return true;
    } catch (error) {
      console.error("mark fine charge paid error", error);
      return false;
    }
  };

  const markFineChargeUnpaid = async (charge: FineCharge) => {
    if (!teamId || charge.status === "unpaid") return true;

    try {
      const updated = await unpayTeamFineCharge(teamId, charge.id);

      if (!updated) return false;

      setFineCharges((current) =>
        markFineChargeUnpaidInList(current, charge.id),
      );

      await reloadEntries();
      return true;
    } catch (error) {
      console.error("mark fine charge unpaid error", error);
      return false;
    }
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

import type {
  CreateFineChargeInput,
  FinanceEntry,
  FineCharge,
  FineChargeStatus,
  FineRuleTrigger,
} from "@/types/finance";
import { useCurrentTeam } from "./useCurrentTeam";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface FineChargeRow {
  id: string;
  match_id: string | null;
  player_id: string;
  rule_id: string;
  rule_name: string;
  trigger: FineRuleTrigger;
  amount: number;
  description: string;
  status: FineCharge["status"];
  paid_entry_id: string | null;
  charged_at: string;
  paid_at: string | null;
}

interface UseFinanceFineChargesParams {
  addEntryWithResult: (
    entry: Omit<FinanceEntry, "id">,
  ) => Promise<FinanceEntry | null>;
  deleteEntry: (entryId: string) => Promise<boolean>;
}

function mapFineCharge(row: FineChargeRow): FineCharge {
  return {
    id: row.id,
    matchId: row.match_id ?? undefined,
    playerId: row.player_id,
    ruleId: row.rule_id,
    ruleName: row.rule_name,
    trigger: row.trigger,
    amount: row.amount,
    description: row.description,
    status: row.status,
    paidEntryId: row.paid_entry_id ?? undefined,
    chargedAt: row.charged_at,
    paidAt: row.paid_at ?? undefined,
  };
}

const FINE_CHARGE_COLUMNS = `
  id,
  match_id,
  player_id,
  rule_id,
  rule_name,
  trigger,
  amount,
  description,
  status,
  paid_entry_id,
  charged_at,
  paid_at
`;

export function useFinanceFineCharges({
  addEntryWithResult,
  deleteEntry,
}: UseFinanceFineChargesParams) {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [fineCharges, setFineCharges] = useState<FineCharge[]>([]);
  const [fineChargesLoaded, setFineChargesLoaded] = useState(false);

  const loadFineCharges = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setFineCharges([]);
      setFineChargesLoaded(true);
      return;
    }

    setFineChargesLoaded(false);

    const { data, error } = await supabase
      .from("finance_fine_charges")
      .select(FINE_CHARGE_COLUMNS)
      .eq("team_id", teamId)
      .order("charged_at", { ascending: false });

    if (error || !data) {
      console.error("loadFineCharges error", error);
      setFineCharges([]);
      setFineChargesLoaded(true);
      return;
    }

    setFineCharges((data as FineChargeRow[]).map(mapFineCharge));
    setFineChargesLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFineCharges();
  }, [loadFineCharges]);

  const createFineCharges = async (inputs: CreateFineChargeInput[]) => {
    if (!teamId || inputs.length === 0) return false;

    const rows = inputs.map((input) => ({
      team_id: teamId,
      match_id: input.matchId ?? null,
      player_id: input.playerId,
      rule_id: input.ruleId,
      rule_name: input.ruleName,
      trigger: input.trigger,
      amount: input.amount,
      description: input.description,
      status: "unpaid",
    }));

    const { data, error } = await supabase
      .from("finance_fine_charges")
      .insert(rows)
      .select(FINE_CHARGE_COLUMNS);

    if (error) {
      console.log("createFineCharges error", error);
      return false;
    }

    const createdCharges = (data as FineChargeRow[]).map(mapFineCharge);

    setFineCharges((prev) => [...createdCharges, ...prev]);
    return true;
  };

  const deleteFineCharge = async (fineChargeId: string) => {
    if (!teamId) return false;

    const { error } = await supabase
      .from("finance_fine_charges")
      .delete()
      .eq("id", fineChargeId)
      .eq("team_id", teamId)
      .eq("status", "unpaid");

    if (error) {
      console.log("deleteFineCharge error", error);
      return false;
    }

    setFineCharges((prev) =>
      prev.filter((charge) => charge.id !== fineChargeId),
    );

    return true;
  };

  const markFineChargePaid = async (charge: FineCharge) => {
    if (!teamId || charge.status === "paid") return true;

    const now = new Date();

    const createdEntry = await addEntryWithResult({
      type: "income",
      amount: charge.amount,
      description: charge.description,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      category: "fine",
      playerId: charge.playerId,
      matchId: charge.matchId,
    });

    if (!createdEntry) return false;

    const { data: updatedCharge, error } = await supabase
      .from("finance_fine_charges")
      .update({
        status: "paid",
        paid_entry_id: createdEntry.id,
        paid_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", charge.id)
      .eq("team_id", teamId)
      .eq("status", "unpaid")
      .select("id")
      .maybeSingle();

    if (error || !updatedCharge) {
      await deleteEntry(createdEntry.id);

      if (error) {
        console.log("markFineChargePaid error", error);
      }

      return false;
    }

    setFineCharges((prev) =>
      prev.map((current) =>
        current.id === charge.id
          ? {
              ...current,
              status: "paid",
              paidEntryId: createdEntry.id,
              paidAt: now.toISOString(),
            }
          : current,
      ),
    );

    return true;
  };

  const markFineChargeUnpaid = async (charge: FineCharge) => {
    if (!teamId || charge.status === "unpaid") return true;

    const previousPaidEntryId = charge.paidEntryId;
    const previousPaidAt = charge.paidAt;

    const { error } = await supabase
      .from("finance_fine_charges")
      .update({
        status: "unpaid",
        paid_entry_id: null,
        paid_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", charge.id)
      .eq("team_id", teamId)
      .eq("status", "paid");

    if (error) {
      console.error("markFineChargeUnpaid error", error);
      return false;
    }

    if (previousPaidEntryId) {
      const deleted = await deleteEntry(previousPaidEntryId);

      if (!deleted) {
        await supabase
          .from("finance_fine_charges")
          .update({
            status: "paid",
            paid_entry_id: previousPaidEntryId,
            paid_at: previousPaidAt ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", charge.id)
          .eq("team_id", teamId);

        return false;
      }
    }

    setFineCharges((prev) =>
      prev.map((current) =>
        current.id === charge.id
          ? {
              ...current,
              status: "unpaid",
              paidEntryId: undefined,
              paidAt: undefined,
            }
          : current,
      ),
    );

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
    createFineCharges,
    deleteFineCharge,
    handleChangeFineChargeStatus,
    reloadFineCharges: loadFineCharges,
  };
}

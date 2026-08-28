import type {
  CreateFineChargeInput,
  FineCharge,
  FineChargeStatus,
  FineRuleTrigger,
} from "@/types/finance";
import { supabase } from "../supabase";

interface FineChargeRow {
  id: string;
  match_id: string | null;
  player_id: string;
  rule_id: string;
  rule_name: string;
  trigger: FineRuleTrigger;
  amount: number;
  description: string;
  status: FineChargeStatus;
  paid_entry_id: string | null;
  charged_at: string;
  paid_at: string | null;
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

function mapFineChargeRow(row: FineChargeRow): FineCharge {
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

export async function getTeamFineCharges(teamId: string) {
  const { data, error } = await supabase
    .from("finance_fine_charges")
    .select(FINE_CHARGE_COLUMNS)
    .eq("team_id", teamId)
    .order("charged_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as FineChargeRow[]).map(mapFineChargeRow);
}

export async function createTeamFineCharges(
  teamId: string,
  inputs: CreateFineChargeInput[],
) {
  const rows = inputs.map((input) => ({
    team_id: teamId,
    match_id: input.matchId ?? null,
    player_id: input.playerId,
    rule_id: input.ruleId,
    rule_name: input.ruleName,
    trigger: input.trigger,
    amount: input.amount,
    description: input.description,
    status: "unpaid" satisfies FineChargeStatus,
  }));

  const { data, error } = await supabase
    .from("finance_fine_charges")
    .upsert(rows, {
      onConflict: "team_id,match_id,player_id,rule_id",
      ignoreDuplicates: true,
    })
    .select(FINE_CHARGE_COLUMNS);

  if (error) {
    throw error;
  }

  return (data as FineChargeRow[]).map(mapFineChargeRow);
}

export async function deleteUnpaidTeamFineCharge(
  teamId: string,
  fineChargeId: string,
) {
  const { error } = await supabase
    .from("finance_fine_charges")
    .delete()
    .eq("id", fineChargeId)
    .eq("team_id", teamId)
    .eq("status", "unpaid");

  if (error) {
    throw error;
  }
}

export async function markTeamFineChargePaid(
  teamId: string,
  fineChargeId: string,
  paidEntryId: string,
  paidAt: string,
) {
  const { data, error } = await supabase
    .from("finance_fine_charges")
    .update({
      status: "paid",
      paid_entry_id: paidEntryId,
      paid_at: paidAt,
      updated_at: paidAt,
    })
    .eq("id", fineChargeId)
    .eq("team_id", teamId)
    .eq("status", "unpaid")
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}

export async function markTeamFineChargeUnpaid(
  teamId: string,
  fineChargeId: string,
) {
  const { error } = await supabase
    .from("finance_fine_charges")
    .update({
      status: "unpaid",
      paid_entry_id: null,
      paid_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", fineChargeId)
    .eq("team_id", teamId)
    .eq("status", "paid");

  if (error) {
    throw error;
  }
}

export async function restoreTeamFineChargePaid(
  teamId: string,
  fineChargeId: string,
  paidEntryId: string,
  paidAt?: string,
) {
  const { error } = await supabase
    .from("finance_fine_charges")
    .update({
      status: "paid",
      paid_entry_id: paidEntryId,
      paid_at: paidAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", fineChargeId)
    .eq("team_id", teamId);

  if (error) {
    throw error;
  }
}

export async function getPlayerUnpaidFineSummary(
  teamId: string,
  playerId: string,
) {
  const { data, error } = await supabase
    .from("finance_fine_charges")
    .select("amount")
    .eq("team_id", teamId)
    .eq("player_id", playerId)
    .eq("status", "unpaid");

  if (error) {
    throw error;
  }

  return {
    count: data.length,
    totalAmount: data.reduce((total, charge) => total + charge.amount, 0),
  };
}

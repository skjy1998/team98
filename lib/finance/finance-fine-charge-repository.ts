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

interface FineChargePaymentResult {
  paid_entry_id: string;
  paid_at: string;
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
  const { data, error } = await supabase
    .from("finance_fine_charges")
    .delete()
    .eq("id", fineChargeId)
    .eq("team_id", teamId)
    .eq("status", "unpaid")
    .select("id")
    .maybeSingle();

  if (error) throw error;

  return data !== null;
}

export async function payTeamFineCharge(
  teamId: string,
  fineChargeId: string,
  paidAt: string,
): Promise<FineChargePaymentResult> {
  const { data, error } = await supabase
    .rpc("pay_team_fine_charge", {
      p_team_id: teamId,
      p_fine_charge_id: fineChargeId,
      p_paid_at: paidAt,
    })
    .single();

  if (error || !data) {
    throw error ?? new Error("벌금 납부 처리 결과가 없습니다.");
  }

  return data as FineChargePaymentResult;
}

export async function unpayTeamFineCharge(
  teamId: string,
  fineChargeId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("unpay_team_fine_charge", {
    p_team_id: teamId,
    p_fine_charge_id: fineChargeId,
  });

  if (error) throw error;

  return data === true;
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

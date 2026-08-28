import type { FeeType, FineRule } from "@/types/finance";
import { supabase } from "../supabase";

interface FinanceSettingsRow {
  due_day: string | null;
  fee_types: FeeType[] | null;
  fine_rules: FineRule[] | null;
}

export interface FinanceSettingsValue {
  dueDay: string;
  feeTypes: FeeType[];
  fineRules: FineRule[];
}

const DEFAULT_FINANCE_SETTINGS: FinanceSettingsValue = {
  dueDay: "1",
  feeTypes: [],
  fineRules: [],
};

export async function getTeamFinanceSettings(
  teamId: string,
): Promise<FinanceSettingsValue> {
  const { data, error } = await supabase
    .from("finance_settings")
    .select("due_day, fee_types, fine_rules")
    .eq("team_id", teamId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return DEFAULT_FINANCE_SETTINGS;
  }

  const row = data as FinanceSettingsRow;

  return {
    dueDay: row.due_day ?? "1",
    feeTypes: row.fee_types ?? [],
    fineRules: row.fine_rules ?? [],
  };
}

export async function saveTeamFinanceSettings(
  teamId: string,
  settings: FinanceSettingsValue,
) {
  const { error } = await supabase.from("finance_settings").upsert(
    {
      team_id: teamId,
      due_day: settings.dueDay,
      fee_types: settings.feeTypes,
      fine_rules: settings.fineRules,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "team_id",
    },
  );

  if (error) {
    throw error;
  }
}

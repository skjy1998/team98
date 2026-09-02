import type {
  FinanceEntry,
  FinanceEntryCategory,
  FinanceEntryType,
} from "@/types/finance";
import { supabase } from "../supabase";

interface FinanceEntryRow {
  id: string;
  type: FinanceEntryType;
  amount: number;
  description: string;
  date: string;
  time: string;
  category: FinanceEntryCategory | null;
  player_id: string | null;
  match_id: string | null;
}

const FINANCE_ENTRY_COLUMNS = `
  id,
  type,
  amount,
  description,
  date,
  time,
  category,
  player_id,
  match_id
`;

function mapFinanceEntryRow(row: FinanceEntryRow): FinanceEntry {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    description: row.description,
    date: row.date,
    time: row.time,
    category: row.category ?? "etc",
    playerId: row.player_id ?? undefined,
    matchId: row.match_id ?? undefined,
  };
}

function getFinanceEntryPayload(entry: Omit<FinanceEntry, "id">) {
  return {
    type: entry.type,
    amount: entry.amount,
    description: entry.description,
    date: entry.date,
    time: entry.time,
    category: entry.category ?? "etc",
    player_id: entry.playerId ?? null,
    match_id: entry.matchId ?? null,
  };
}

export async function getTeamFinanceEntries(teamId: string) {
  const { data, error } = await supabase
    .from("finance_entries")
    .select(FINANCE_ENTRY_COLUMNS)
    .eq("team_id", teamId)
    .order("date", { ascending: false })
    .order("time", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as FinanceEntryRow[]).map(mapFinanceEntryRow);
}

export async function createTeamFinanceEntry(
  teamId: string,
  entry: Omit<FinanceEntry, "id">,
) {
  const { data, error } = await supabase
    .from("finance_entries")
    .insert({
      team_id: teamId,
      ...getFinanceEntryPayload(entry),
    })
    .select(FINANCE_ENTRY_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapFinanceEntryRow(data as FinanceEntryRow);
}

export async function updateTeamFinanceEntry(
  teamId: string,
  entryId: string,
  updates: Omit<FinanceEntry, "id">,
) {
  const { data, error } = await supabase
    .from("finance_entries")
    .update({
      ...getFinanceEntryPayload(updates),
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .eq("team_id", teamId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  return data !== null;
}

export async function deleteTeamFinanceEntry(teamId: string, entryId: string) {
  const { data, error } = await supabase
    .from("finance_entries")
    .delete()
    .eq("id", entryId)
    .eq("team_id", teamId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  return data !== null;
}

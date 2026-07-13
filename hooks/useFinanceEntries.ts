import { FinanceEntry } from "@/types/finance";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "./useCurrentTeam";
import { supabase } from "@/lib/supabase";

const DEFAULT_ENTRIES: FinanceEntry[] = [];

export function useFinanceEntries() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [entries, setEntries] = useState<FinanceEntry[]>(DEFAULT_ENTRIES);
  const [entriesLoaded, setEntriesLoaded] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setEntries([]);
      setEntriesLoaded(true);
      return;
    }

    setEntriesLoaded(false);

    const { data, error } = await supabase
      .from("finance_entries")
      .select("id, type, amount, description, date, time")
      .eq("team_id", teamId)
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (error || !data) {
      setEntries([]);
      setEntriesLoaded(true);
      return;
    }

    setEntries(
      data.map((entry) => ({
        id: entry.id,
        type: entry.type,
        amount: entry.amount,
        description: entry.description,
        date: entry.date,
        time: entry.time,
      })),
    );
    setEntriesLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEntries();
  }, [loadEntries]);

  const addEntry = async (entry: Omit<FinanceEntry, "id">) => {
    if (!teamId) return false;

    const { data, error } = await supabase
      .from("finance_entries")
      .insert({
        team_id: teamId,
        type: entry.type,
        amount: entry.amount,
        description: entry.description,
        date: entry.date,
        time: entry.time,
      })
      .select("id, type, amount, description, date, time")
      .single();

    if (error || !data) return false;

    setEntries((prev) => [
      {
        id: data.id,
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: data.date,
        time: data.time,
      },
      ...prev,
    ]);

    if (error || !data) {
      console.log("finance_entries insert error", error);
      return false;
    }

    return true;
  };

  const updateEntry = async (
    entryId: string,
    updates: Omit<FinanceEntry, "id">,
  ) => {
    if (!teamId) return false;

    const { error } = await supabase
      .from("finance_entries")
      .update({
        type: updates.type,
        amount: updates.amount,
        description: updates.description,
        date: updates.date,
        time: updates.time,
        updated_at: new Date().toISOString(),
      })
      .eq("id", entryId)
      .eq("team_id", teamId);

    if (error) return false;

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, ...updates } : entry,
      ),
    );

    return true;
  };

  const deleteEntry = async (entryId: string) => {
    if (!teamId) return false;

    const { error } = await supabase
      .from("finance_entries")
      .delete()
      .eq("id", entryId)
      .eq("team_id", teamId);

    if (error) return false;

    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    return true;
  };

  return {
    entries,
    entriesLoaded,
    addEntry,
    updateEntry,
    deleteEntry,
    reloadEntries: loadEntries,
  };
}

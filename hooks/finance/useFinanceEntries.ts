import { FinanceEntry } from "@/types/finance";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCurrentTeam } from "../team/useCurrentTeam";

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
      .select(
        "id, type, amount, description, date, time, category, player_id, match_id",
      )
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
        category: entry.category ?? "etc",
        playerId: entry.player_id ?? undefined,
        matchId: entry.match_id ?? undefined,
      })),
    );
    setEntriesLoaded(true);
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEntries();
  }, [loadEntries]);

  const addEntryWithResult = async (
    entry: Omit<FinanceEntry, "id">,
  ): Promise<FinanceEntry | null> => {
    if (!teamId) return null;

    const { data, error } = await supabase
      .from("finance_entries")
      .insert({
        team_id: teamId,
        type: entry.type,
        amount: entry.amount,
        description: entry.description,
        date: entry.date,
        time: entry.time,
        category: entry.category ?? "etc",
        player_id: entry.playerId ?? null,
        match_id: entry.matchId ?? null,
      })
      .select(
        "id, type, amount, description, date, time, category, player_id, match_id",
      )
      .single();

    if (error || !data) return null;

    const createdEntry: FinanceEntry = {
      id: data.id,
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: data.date,
      time: data.time,
      category: data.category ?? "etc",
      playerId: data.player_id ?? undefined,
      matchId: data.match_id ?? undefined,
    };

    setEntries((prev) => [createdEntry, ...prev]);

    return createdEntry;
  };

  const addEntry = async (entry: Omit<FinanceEntry, "id">) => {
    const createdEntry = await addEntryWithResult(entry);
    return createdEntry !== null;
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
        category: updates.category ?? "etc",
        player_id: updates.playerId ?? null,
        match_id: updates.matchId ?? null,
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
    addEntryWithResult,
    updateEntry,
    deleteEntry,
    reloadEntries: loadEntries,
  };
}

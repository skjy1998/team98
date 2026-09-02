import type { FinanceEntry } from "@/types/finance";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import {
  createTeamFinanceEntry,
  deleteTeamFinanceEntry,
  getTeamFinanceEntries,
  updateTeamFinanceEntry,
} from "@/lib/finance/finance-entry-repository";

export function useFinanceEntries() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [entriesLoaded, setEntriesLoaded] = useState(false);
  const [entriesError, setEntriesError] = useState("");

  const loadEntries = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setEntries([]);
      setEntriesLoaded(true);
      setEntriesError("");
      return;
    }

    setEntriesLoaded(false);
    setEntriesError("");

    try {
      const nextEntries = await getTeamFinanceEntries(teamId);
      setEntries(nextEntries);
    } catch (error) {
      console.error("finance entries load error", error);
      setEntries([]);
      setEntriesError("입출금 내역을 불러오지 못했어요.");
    } finally {
      setEntriesLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEntries();
  }, [loadEntries]);

  const addEntry = async (entry: Omit<FinanceEntry, "id">) => {
    if (!teamId) return false;

    try {
      const createdEntry = await createTeamFinanceEntry(teamId, entry);

      setEntries((current) => [createdEntry, ...current]);
      return true;
    } catch (error) {
      console.error("finance entry create error", error);
      return false;
    }
  };

  const updateEntry = async (
    entryId: string,
    updates: Omit<FinanceEntry, "id">,
  ) => {
    if (!teamId) return false;

    try {
      const updated = await updateTeamFinanceEntry(teamId, entryId, updates);

      if (!updated) return false;

      setEntries((current) =>
        current.map((entry) =>
          entry.id === entryId ? { ...entry, ...updates } : entry,
        ),
      );

      return true;
    } catch (error) {
      console.error("finance entry update error", error);
      return false;
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!teamId) return false;

    try {
      const deleted = await deleteTeamFinanceEntry(teamId, entryId);

      if (!deleted) return false;

      setEntries((current) => current.filter((entry) => entry.id !== entryId));

      return true;
    } catch (error) {
      console.error("finance entry delete error", error);
      return false;
    }
  };

  return {
    entries,
    entriesLoaded,
    entriesError,
    addEntry,
    updateEntry,
    deleteEntry,
    reloadEntries: loadEntries,
  };
}

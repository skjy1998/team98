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

  const addEntryWithResult = async (
    entry: Omit<FinanceEntry, "id">,
  ): Promise<FinanceEntry | null> => {
    if (!teamId) return null;

    try {
      const createdEntry = await createTeamFinanceEntry(teamId, entry);

      setEntries((current) => [createdEntry, ...current]);
      return createdEntry;
    } catch (error) {
      console.error("finance entry create error", error);
      return null;
    }
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

    try {
      await updateTeamFinanceEntry(teamId, entryId, updates);

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
      await deleteTeamFinanceEntry(teamId, entryId);

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
    addEntryWithResult,
    updateEntry,
    deleteEntry,
    reloadEntries: loadEntries,
  };
}
